import type { GithubUser } from "./types";
import { notFound } from "next/navigation";
import type { GithubUserRepo } from "./types";

export async function getGithubUser(username: string): Promise<GithubUser> {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
  });
  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

export async function getGithubUserRepos(username: string): Promise<GithubUserRepo[] | null> {
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
  });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

export async function getGithubUserRepo(
  username: string,
  repoName: string
): Promise<GithubUserRepo | null> {
  const res = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
  });

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetches the repo's README as raw text. Returns null if the repo has none —
 * this is common (empty repos, non-standard layouts) and shouldn't be an error.
 */
export async function getRepoReadme(username: string, repoName: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.raw+json",
    },
  });

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const text = await res.text();
  // Cap length so one huge README can't blow out the chat's prompt context
  return text.slice(0, 8000);
}

/**
 * Returns a flat list of file paths (blobs only, no directories) for the repo's
 * default branch. Fails soft to an empty array — an empty tree still produces
 * a usable, honest answer from the model ("file structure unavailable").
 */
export async function getRepoTree(
  username: string,
  repoName: string,
  branch: string
): Promise<string[]> {
  const res = await fetch(
    `https://api.github.com/repos/${username}/${repoName}/git/trees/${branch}?recursive=1`,
    { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  if (!Array.isArray(data.tree)) {
    return [];
  }

  return data.tree
    .filter((item: { type: string }) => item.type === "blob")
    .map((item: { path: string }) => item.path)
    .slice(0, 300);
}

export type RepoCommit = {
  sha: string;
  message: string;
  author: string | null;
  date: string | null;
};

/**
 * Returns the most recent commits on the repo's default branch. Fails soft
 * to an empty array for the same reason as getRepoTree.
 */
export async function getRepoCommits(username: string, repoName: string): Promise<RepoCommit[]> {
  const res = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=10`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((c: any) => ({
    sha: c.sha?.slice(0, 7) ?? "",
    message: c.commit?.message?.split("\n")[0] ?? "",
    author: c.commit?.author?.name ?? null,
    date: c.commit?.author?.date ?? null,
  }));
}

export type CommitActivityWeek = {
  week: number;
  total: number;
  days: number[];
};

/**
 * Last 52 weeks of commit counts for a repo. GitHub may respond with 202 while
 * stats are being computed — we retry a few times before giving up.
 */
export async function getRepoCommitActivity(
  owner: string,
  repo: string,
  retries = 3
): Promise<CommitActivityWeek[] | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );

    if (res.status === 202) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      continue;
    }
    if (res.status === 204 || res.status === 404) {
      return null;
    }
    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return Array.isArray(data) ? data : null;
  }

  return null;
}