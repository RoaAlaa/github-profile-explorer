import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGithubUserRepo, getRepoReadme, getRepoTree, getRepoCommits } from "@/lib/github";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Bound how much prior conversation we feed back into the model. Without this,
// a long-running chat thread would keep growing the prompt (and cost/latency)
// on every single turn.
const MAX_HISTORY_MESSAGES = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const repoName = searchParams.get("repoName");

  if (!username || !repoName) {
    return Response.json({ error: "username and repoName are required" }, { status: 400 });
  }

  const messages = await prisma.chatMessage.findMany({
    where: { username, repoName },
    orderBy: { createdAt: "asc" },
  });

  return Response.json({ messages });
}

export async function POST(req: NextRequest) {
  const { username, repoName, message } = await req.json();

  if (!username || !repoName || !message?.trim()) {
    return Response.json({ error: "username, repoName and message are required" }, { status: 400 });
  }

  const repo = await getGithubUserRepo(username, repoName);
  if (!repo) {
    return Response.json({ error: "Repository not found" }, { status: 404 });
  }

  const [readme, tree, commits] = await Promise.all([
    getRepoReadme(username, repoName),
    getRepoTree(username, repoName, repo.default_branch),
    getRepoCommits(username, repoName),
  ]);

  // Most recent N messages, oldest-first, for conversational continuity.
  const recentDesc = await prisma.chatMessage.findMany({
    where: { username, repoName },
    orderBy: { createdAt: "desc" },
    take: MAX_HISTORY_MESSAGES,
  });
  const priorMessages = recentDesc.reverse();

  await prisma.chatMessage.create({
    data: { username, repoName, role: "user", content: message },
  });

  const systemPrompt = `You are a technical assistant answering questions about a specific GitHub repository.
Ground every answer strictly in the repository data provided below. Do not rely on prior
knowledge you may have about this project from training — only use what's given here.
If the data doesn't contain the answer, say so plainly instead of guessing.

Repository: ${username}/${repoName}
Description: ${repo.description ?? "No description provided"}
Primary language: ${repo.language ?? "Unknown"}
Default branch: ${repo.default_branch}

README (may be truncated):
${readme ?? "No README found in this repository."}

File structure (top-level paths, truncated to 300 entries):
${tree.length ? tree.join("\n") : "Unable to load file structure."}

Recent commits:
${
  commits.length
    ? commits
        .map((c) => `${c.sha} - ${c.message} (${c.author ?? "unknown"}, ${c.date ?? "unknown date"})`)
        .join("\n")
    : "No commit data available."
}`;

  const groqMessages = [
    { role: "system", content: systemPrompt },
    ...priorMessages.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  const groqRes = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: 0.3,
      stream: true,
    }),
  });

  if (!groqRes.ok || !groqRes.body) {
    return Response.json({ error: `Groq API error: ${groqRes.status}` }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let fullReply = "";

  // Groq streams OpenAI-style SSE ("data: {...}\n\n" frames). We parse those
  // server-side and forward just the token text to the client, so the client
  // doesn't need any SSE-parsing logic of its own — it just reads plain text.
  const stream = new ReadableStream({
    async start(controller) {
      const reader = groqRes.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;

            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;

            try {
              const parsed = JSON.parse(payload);
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) {
                fullReply += token;
                controller.enqueue(encoder.encode(token));
              }
            } catch {
              // Malformed/partial SSE fragment — skip it rather than killing the stream
            }
          }
        }

        if (fullReply) {
          await prisma.chatMessage.create({
            data: { username, repoName, role: "assistant", content: fullReply },
          });
        }
      } catch (err) {
        controller.error(err);
        return;
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}