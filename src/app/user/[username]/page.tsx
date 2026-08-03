// src/app/user/[username]/page.tsx
import { Suspense } from "react";
import { getGithubUser, getGithubUserRepos } from "@/lib/github";
import { computeUserStats } from "@/lib/stats";
import { notFound } from "next/navigation";
import ProfileCard from "@/components/ProfileCard";
import RepoList from "@/components/RepoList";
import AISummary from "@/components/AiSummary";

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
    <div>
      <ProfileCard user={user} />
      <Suspense fallback={<div className="p-4 text-sm text-gray-500">Analyzing profile…</div>}>
        <AISummary user={user} stats={stats} repos={safeRepos} />
      </Suspense>
      <RepoList repos={safeRepos} />
    </div>
  );
}