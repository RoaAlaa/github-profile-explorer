import { getGithubUser } from "@/lib/github";
import ProfileCard from "@/components/ProfileCard";
import { getGithubUserRepos } from "@/lib/github";
import RepoList from "@/components/RepoList";
import { notFound } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [user, repos] = await Promise.all([
    getGithubUser(username),
    getGithubUserRepos(username)
  ]);
  if (!user) notFound();

  return (
  <div>
    <ProfileCard user={user} />
    <RepoList repos={repos ?? []} />
  </div>
);
}

