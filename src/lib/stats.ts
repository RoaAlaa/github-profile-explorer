import { getRepoCommitActivity } from "./github";
import type { GithubUser, GithubUserRepo, UserStats } from "./types";

const MAX_REPOS_FOR_COMMIT_STATS = 15;
const WEEKS_IN_YEAR = 52;

export function computeUserStats(user: GithubUser, repos: GithubUserRepo[]): UserStats {

    const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);

    const languageCount: Record<string, number> = {};
    for (const repo of repos) {
        if (repo.language) {
            languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        }
    }
    let topLanguage: string | null = null;
    let maxCount = 0;
    for (const [language, count] of Object.entries(languageCount)) {
        if (count > maxCount) {
            maxCount = count;
            topLanguage = language;
        }
    }
    const createdDate = new Date(user.created_at);
    const currentDate = new Date();
    const accountAgeYears = currentDate.getFullYear() - createdDate.getFullYear();

    return {
        username: user.login,
        totalRepos: user.public_repos,
        totalStars,
        topLanguage,
        followers: user.followers,
        accountAgeYears,
        commitsLastYear: null,
        avgCommitsPerWeek: null,
    };
}

/** Aggregates commit_activity stats across a user's non-fork repos. */
export async function fetchUserCommitFrequency(
    username: string,
    repos: GithubUserRepo[]
): Promise<{ commitsLastYear: number; avgCommitsPerWeek: number }> {
    const ownedRepos = repos
        .filter((repo) => !repo.fork)
        .sort(
            (a, b) =>
                new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        .slice(0, MAX_REPOS_FOR_COMMIT_STATS);

    if (ownedRepos.length === 0) {
        return { commitsLastYear: 0, avgCommitsPerWeek: 0 };
    }

    const activities = await Promise.all(
        ownedRepos.map((repo) => getRepoCommitActivity(username, repo.name))
    );

    let commitsLastYear = 0;
    for (const weeks of activities) {
        if (!weeks) continue;
        for (const week of weeks) {
            commitsLastYear += week.total;
        }
    }

    return {
        commitsLastYear,
        avgCommitsPerWeek: Math.round((commitsLastYear / WEEKS_IN_YEAR) * 10) / 10,
    };
}