import Link from "next/link";
import { GithubUserRepo } from "@/lib/types";

export default function RepoCard({
  repo,
  username,
}: {
  repo: GithubUserRepo;
  username: string;
}) {
  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <div className="space-y-1.5">
        <h3 className="font-medium">
          <Link
            href={`/user/${username}/${repo.name}`}
            className="hover:underline"
          >
            {repo.name}
          </Link>
        </h3>

        {repo.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {repo.description}
          </p>
        )}

        <p className="text-sm text-gray-500">
          {repo.stargazers_count} stars · {repo.language ?? "—"} · Updated{" "}
          {new Date(repo.updated_at).toLocaleDateString()}
        </p>

        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-gray-900 dark:text-gray-200 hover:underline"
        >
          View on GitHub ↗
        </a>
      </div>
    </li>
  );
}
