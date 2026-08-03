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

export async function getGithubUserRepos(username:string): Promise<GithubUserRepo[] | null> {
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
