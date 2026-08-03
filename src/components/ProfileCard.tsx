import Link from "next/link";
import type { GithubUser } from "@/lib/types";

export default function ProfileCard({ user }: { user: GithubUser }) {
  const displayName = user.name ?? user.login;

  return (
    <header className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
      <div className="flex items-start gap-5">
        <img
          src={user.avatar_url}
          alt={`${displayName}'s avatar`}
          width={80}
          height={80}
          className="h-20 w-20 shrink-0 rounded-full border border-gray-200 dark:border-gray-800 object-cover"
        />

        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight truncate">
              {displayName}
            </h1>
            <p className="text-sm text-gray-500">@{user.login}</p>
          </div>

          {user.bio && (
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {user.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span>{user.public_repos} repos</span>
            <span>{user.followers} followers</span>
            <span>{user.following} following</span>
            <a
              href={`https://github.com/${user.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-gray-200 hover:underline"
            >
              View on GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
