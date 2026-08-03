import type { GithubUser } from "@/lib/types";

export default function ProfileCard({ user }: { user: GithubUser }) {
  return (
    <div>
      <img src={user.avatar_url} width={80} height={80} />
      <h2>{user.name ?? user.login}</h2>
      <p>{user.bio}</p>
      <p>{user.public_repos} repos · {user.followers} followers</p>
    </div>
  );
}