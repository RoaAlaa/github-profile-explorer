import { GithubUserRepo } from "@/lib/types";
import RepoCard from "@/components/RepoCard";

export default function RepoList({
  repos,
  username,
}: {
  repos: GithubUserRepo[];
  username: string;
}) {
  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
      <h2 className="text-lg font-medium mb-2">Repositories</h2>

      {repos.length === 0 ? (
        <p className="text-sm text-gray-500">No public repositories.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} username={username} />
          ))}
        </ul>
      )}
    </section>
  );
}
