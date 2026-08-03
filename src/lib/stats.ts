import type {GithubUser, GithubUserRepo, UserStats} from "./types";

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
        accountAgeYears
    };
}