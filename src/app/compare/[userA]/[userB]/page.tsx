import { getGithubUser, getGithubUserRepos } from "@/lib/github";
import { computeUserStats, fetchUserCommitFrequency } from "@/lib/stats";
import CompareView from "@/components/CompareView";
import { notFound } from "next/navigation";

export default async function CompareResultsPage({
  params,
}: {
  params: Promise<{ userA: string; userB: string }>;
}) {
  const { userA, userB } = await params;

  const [[userAInfo, userARepos], [userBInfo, userBRepos]] = await Promise.all([
    Promise.all([getGithubUser(userA), getGithubUserRepos(userA)]),
    Promise.all([getGithubUser(userB), getGithubUserRepos(userB)]),
  ]);

  if (!userAInfo || !userBInfo) notFound();

  const [commitFreqA, commitFreqB] = await Promise.all([
    fetchUserCommitFrequency(userA, userARepos ?? []),
    fetchUserCommitFrequency(userB, userBRepos ?? []),
  ]);

  const statsA = { ...computeUserStats(userAInfo, userARepos ?? []), ...commitFreqA };
  const statsB = { ...computeUserStats(userBInfo, userBRepos ?? []), ...commitFreqB };

  return (
    <CompareView
      userA={userAInfo}
      userB={userBInfo}
      statsA={statsA}
      statsB={statsB}
    />
  );
}
