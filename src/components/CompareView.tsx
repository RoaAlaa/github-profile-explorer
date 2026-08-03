import type { UserStats } from "@/lib/types";

function StatRow({ label, valueA, valueB }: { label: string; valueA: string | number; valueB: string | number }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2 border-b">
      <span className="text-right font-medium">{valueA}</span>
      <span className="text-center text-gray-500">{label}</span>
      <span className="font-medium">{valueB}</span>
    </div>
  );
}

export default function CompareView({ statsA, statsB }: { statsA: UserStats; statsB: UserStats }) {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-4 pb-2 font-bold border-b-2">
        <span className="text-right">{statsA.username}</span>
        <span className="text-center">vs</span>
        <span>{statsB.username}</span>
      </div>
      <StatRow label="Public Repos" valueA={statsA.totalRepos} valueB={statsB.totalRepos} />
      <StatRow label="Total Stars" valueA={statsA.totalStars} valueB={statsB.totalStars} />
      <StatRow label="Top Language" valueA={statsA.topLanguage ?? "N/A"} valueB={statsB.topLanguage ?? "N/A"} />
      <StatRow label="Followers" valueA={statsA.followers} valueB={statsB.followers} />
      <StatRow label="Account Age (yrs)" valueA={statsA.accountAgeYears} valueB={statsB.accountAgeYears} />
    </div>
  );
}