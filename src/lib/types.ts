export interface GithubUser {
  login: string; // The username of the GitHub user
  url: string; // The API URL of the user
  avatar_url: string; // The URL of the user's avatar image
  repos_url: string; // The URL of the user's repositories
  name: string | null; // The name of the user
  email: string | null; // The email of the user
  bio: string | null; // The biography of the user
  public_repos: number; // The number of public repositories of the user
  followers: number; // The number of followers of the user
  following: number; // The number of following users
  created_at: string; // The creation timestamp of the user
}

export interface GithubUserRepo {
  stargazers_count: number; // The number of stars the repository has
  id: number; // The unique identifier of the repository
  name: string; // The name of the repository
  html_url: string; // The URL of the repository
  description: string | null; // The description of the repository
  language: string | null; // The primary language of the repository
  updated_at: string; // The last updated timestamp of the repository
}

export interface UserStats {
  username: string;
  totalRepos: number;
  totalStars: number;
  topLanguage: string | null;
  followers: number;
  accountAgeYears: number;
}