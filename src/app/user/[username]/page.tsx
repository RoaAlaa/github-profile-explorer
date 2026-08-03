import { Suspense } from "react";
import Link from "next/link";
import { getGithubUser, getGithubUserRepos } from "@/lib/github";
import { computeUserStats } from "@/lib/stats";
import { notFound } from "next/navigation";
import ProfileCard from "@/components/ProfileCard";
import RepoList from "@/components/RepoList";
import AISummary from "@/components/AiSummary";
import NotesSection from "@/components/NotesSection";

export const dynamic = "force-dynamic";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [user, repos] = await Promise.all([
    getGithubUser(username),
    getGithubUserRepos(username),
  ]);

  if (!user) notFound();

  const safeRepos = repos ?? [];
  const stats = computeUserStats(user, safeRepos);

  return (
    <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      >
        ← Back
      </Link>

      <ProfileCard user={user} />

      <Suspense
        fallback={
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-sm text-gray-500">
            Analyzing profile…
          </div>
        }
      >
        <AISummary user={user} stats={stats} repos={safeRepos} />
      </Suspense>

      <Suspense
        fallback={
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-sm text-gray-500">
            Loading notes…
          </div>
        }
      >
        <NotesSection username={username} />
      </Suspense>

      <RepoList repos={safeRepos} username={username} />
    </main>
  );
}
