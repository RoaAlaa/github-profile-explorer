import { GithubUserRepo } from "@/lib/types";

export default function RepoCard({ repo }: { repo: GithubUserRepo }) {
  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="text-lg font-semibold">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
          {repo.name}
        </a>
      </h3>
      <p>{repo.description}</p>
      <p className="text-sm text-gray-500">
        ⭐ {repo.stargazers_count} · {repo.language ?? "—"} · Updated{" "}
        {new Date(repo.updated_at).toLocaleDateString()}
      </p>
    </div>
  );
}