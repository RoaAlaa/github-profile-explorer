import {GithubUserRepo} from "@/lib/types";
import RepoCard from "@/components/RepoCard";

export default function RepoList({ repos }: { repos: GithubUserRepo[] }) {
  return (
    <div>
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}