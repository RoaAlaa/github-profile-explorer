import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getGithubUserRepo,
  getRepoReadme,
  getRepoTree,
  getRepoCommits,
} from "@/lib/github";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const MAX_HISTORY_MESSAGES = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const repoName = searchParams.get("repoName");

  if (!username || !repoName) {
    return Response.json(
      { error: "username and repoName are required" },
      { status: 400 }
    );
  }

  const messages = await prisma.chatMessage.findMany({
    where: { username, repoName },
    orderBy: { createdAt: "asc" },
  });

  return Response.json({ messages });
}

export async function POST(req: NextRequest) {
  try {
    const { username, repoName, message } = await req.json();

    if (!username || !repoName || !message?.trim()) {
      return Response.json(
        { error: "username, repoName and message are required" },
        { status: 400 }
      );
    }

    const repo = await getGithubUserRepo(username, repoName);

    if (!repo) {
      return Response.json(
        { error: "Repository not found" },
        { status: 404 }
      );
    }

    const [readme, tree, commits] = await Promise.all([
      getRepoReadme(username, repoName),
      getRepoTree(username, repoName, repo.default_branch),
      getRepoCommits(username, repoName),
    ]);

    const recentDesc = await prisma.chatMessage.findMany({
      where: { username, repoName },
      orderBy: { createdAt: "desc" },
      take: MAX_HISTORY_MESSAGES,
    });

    const priorMessages = recentDesc.reverse();

    await prisma.chatMessage.create({
      data: {
        username,
        repoName,
        role: "user",
        content: message,
      },
    });

    const systemPrompt = `You are a technical assistant answering questions about a specific GitHub repository.

Ground every answer STRICTLY in the repository data below.

If the answer is not contained in the provided information, say you don't know.

Repository: ${username}/${repoName}
Description: ${repo.description ?? "No description"}
Primary language: ${repo.language ?? "Unknown"}
Default branch: ${repo.default_branch}

README:
${readme ?? "No README found."}

File tree:
${tree.length ? tree.join("\n") : "No file tree available."}

Recent commits:
${
  commits.length
    ? commits
        .map(
          (c) =>
            `${c.sha} - ${c.message} (${c.author ?? "unknown"}, ${
              c.date ?? "unknown"
            })`
        )
        .join("\n")
    : "No commits available."
}
`;

    const groqMessages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...priorMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      {
        role: "user",
        content: message,
      },
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

    // ===== NEW ERROR HANDLING =====

    if (!groqRes.ok) {
      const errorBody = await groqRes.text();

      console.error("========== GROQ ERROR ==========");
      console.error("Status:", groqRes.status);
      console.error(errorBody);
      console.error("================================");

      return Response.json(
        {
          error: "Groq API request failed",
          status: groqRes.status,
          details: errorBody,
        },
        { status: groqRes.status }
      );
    }

    if (!groqRes.body) {
      return Response.json(
        {
          error: "Groq returned no response body.",
        },
        { status: 502 }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let fullReply = "";

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
                // Ignore malformed SSE chunks
              }
            }
          }

          if (fullReply) {
            await prisma.chatMessage.create({
              data: {
                username,
                repoName,
                role: "assistant",
                content: fullReply,
              },
            });
          }

          controller.close();
        } catch (err) {
          console.error(err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Repo Chat Error:", error);

    return Response.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}