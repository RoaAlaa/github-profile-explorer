import { analyzeUserProfile } from "@/lib/ai";
import type { GithubUser, GithubUserRepo, UserStats } from "@/lib/types";

export default async function AISummary({
  user,
  stats,
  repos,
}: {
  user: GithubUser;
  stats: UserStats;
  repos: GithubUserRepo[];
}) {
  try {
    const summary = await analyzeUserProfile(user, stats, repos);
    return (
      <div className="border rounded-lg p-4 mb-6 bg-gray-50">
        <h2 className="font-semibold mb-2">AI Analysis</h2>
        <p className="text-sm leading-relaxed whitespace-pre-line">{summary}</p>
      </div>
    );
  } catch {
    // Don't let an AI/network failure take down the whole profile page —
    // degrade gracefully instead.
    return (
      <div className="border rounded-lg p-4 mb-6 text-sm text-gray-500">
        AI analysis unavailable right now.
      </div>
    );
  }
}