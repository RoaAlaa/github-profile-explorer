import Link from "next/link";
import type { GithubUser, UserStats } from "@/lib/types";

const cardClass =
  "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6";

function StatRow({
  label,
  valueA,
  valueB,
}: {
  label: string;
  valueA: string | number;
  valueB: string | number;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 py-3 text-sm">
      <span className="text-right font-medium">{valueA}</span>
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{valueB}</span>
    </div>
  );
}

function UserHeader({ user }: { user: GithubUser }) {
  const displayName = user.name ?? user.login;

  return (
    <Link
      href={`/user/${user.login}`}
      className="flex flex-col items-center gap-3 text-center transition-opacity hover:opacity-80 sm:flex-row sm:text-left"
    >
      <img
        src={user.avatar_url}
        alt={`${displayName}'s avatar`}
        width={64}
        height={64}
        className="h-16 w-16 shrink-0 rounded-full border border-gray-200 dark:border-gray-800 object-cover"
      />
      <div className="min-w-0">
        <p className="font-medium truncate">{displayName}</p>
        <p className="text-sm text-gray-500">@{user.login}</p>
      </div>
    </Link>
  );
}

export default function CompareView({
  userA,
  userB,
  statsA,
  statsB,
}: {
  userA: GithubUser;
  userB: GithubUser;
  statsA: UserStats;
  statsB: UserStats;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
      <Link
        href="/compare"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      >
        ← Back to compare
      </Link>

      <section className={cardClass}>
        <div className="flex flex-col items-center gap-6 pb-6 mb-2 border-b border-gray-200 dark:border-gray-800 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
          <UserHeader user={userA} />
          <span className="text-sm font-medium text-gray-500">vs</span>
          <UserHeader user={userB} />
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          <StatRow
            label="Public repos"
            valueA={statsA.totalRepos}
            valueB={statsB.totalRepos}
          />
          <StatRow
            label="Total stars"
            valueA={statsA.totalStars}
            valueB={statsB.totalStars}
          />
          <StatRow
            label="Top language"
            valueA={statsA.topLanguage ?? "N/A"}
            valueB={statsB.topLanguage ?? "N/A"}
          />
          <StatRow
            label="Followers"
            valueA={statsA.followers}
            valueB={statsB.followers}
          />
          <StatRow
            label="Account age (yrs)"
            valueA={statsA.accountAgeYears}
            valueB={statsB.accountAgeYears}
          />
          <StatRow
            label="Commits (last year)"
            valueA={statsA.commitsLastYear ?? "N/A"}
            valueB={statsB.commitsLastYear ?? "N/A"}
          />
          <StatRow
            label="Commit frequency"
            valueA={
              statsA.avgCommitsPerWeek != null
                ? `${statsA.avgCommitsPerWeek}/wk`
                : "N/A"
            }
            valueB={
              statsB.avgCommitsPerWeek != null
                ? `${statsB.avgCommitsPerWeek}/wk`
                : "N/A"
            }
          />
        </div>
      </section>
    </main>
  );
}
