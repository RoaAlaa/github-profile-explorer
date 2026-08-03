import { getGithubUser, getGithubUserRepos } from "@/lib/github";
import { computeUserStats } from "@/lib/stats";
import CompareView from "@/components/CompareView";
import { notFound } from "next/navigation";

export default async function ComparePage({
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

const statsA = computeUserStats(userAInfo, userARepos ?? []);
const statsB = computeUserStats(userBInfo, userBRepos ?? []);

  return <CompareView statsA={statsA} statsB={statsB} />;
}