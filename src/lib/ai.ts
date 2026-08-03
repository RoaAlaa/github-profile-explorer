import type { GithubUserRepo , GithubUser, UserStats} from "@/lib/types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are a technical analyst. Expert in analyzing and summarizing a GitHub developer profile.
You will be given a user's public GitHub data as JSON. Your task is to summarize the user profile and provide
a detailed and insightful analysis based only on the data provided.

Rules:
1. Do not invent or assume any data that is not provided in the JSON.
2. If the user has few repositories or little data, provide a concise summary and state honestly that the data is limited.
3. Plain, professional tone — no markdown formatting, no emojis, no lists, no bullet points.
4. Write 3-4 short paragraphs: (1) overview of who they seem to be as a developer,
   (2) notable projects or patterns in their repos, (3) technical strengths suggested by their languages/stars.`;


export async function analyzeUserProfile(
    user: GithubUser,
    stats: UserStats,
    repos: GithubUserRepo[]
): Promise<string> {
    const topRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
        .map((r) => ({
            name: r.name,
            description: r.description,
            language: r.language,
            stars: r.stargazers_count,
        }));
        const userPrompt = JSON.stringify({ profile: user, stats, topRepos });

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}


