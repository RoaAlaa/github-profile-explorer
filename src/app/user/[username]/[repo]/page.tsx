import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGithubUserRepo } from "@/lib/github";
import NotesSection from "@/components/NotesSection";
import RepoChat from "@/components/RepoChat";

export const dynamic = "force-dynamic";

export default async function RepoPage({
  params,
}: {
  params: Promise<{ username: string; repo: string }>;
}) {
  const { username, repo: repoName } = await params;
  const repo = await getGithubUserRepo(username, repoName);

  if (!repo) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
      <Link
        href={`/user/${username}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      >
        ← Back to {username}
      </Link>

      <header className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 space-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{repo.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {username}/{repo.name}
          </p>
        </div>

        {repo.description && (
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {repo.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <span>{repo.stargazers_count} stars</span>
          <span>{repo.language ?? "—"}</span>
          <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 dark:text-gray-200 hover:underline"
          >
            View on GitHub ↗
          </a>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-sm text-gray-500">
            Loading notes…
          </div>
        }
      >
        <NotesSection username={username} repoName={repoName} />
      </Suspense>

      <RepoChat username={username} repoName={repoName} />
    </main>
  );
}
