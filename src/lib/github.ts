import { z } from "zod";

export const repoSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/,
    "Repository must be in format 'owner/name'",
  );

export function parseRepoString(repo: string) {
  const validated = repoSchema.parse(repo);
  const [owner, name] = validated.split("/");
  return { owner, name, full: validated };
}

export function validateRepoString(repo: string): boolean {
  try {
    repoSchema.parse(repo);
    return true;
  } catch {
    return false;
  }
}

export function formatRepoString(owner: string, name: string): string {
  return `${owner}/${name}`;
}

export interface GitHubRepo {
  id: number;
  owner: {
    login: string;
    avatar_url: string;
  };
  name: string;
  full_name: string;
  description?: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage?: string;
  topics: string[];
  private: boolean;
}

export interface GitHubOrg {
  id: number;
  login: string;
  avatar_url: string;
  description?: string;
}

export async function fetchGitHubRepo(
  owner: string,
  name: string,
): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${name}`,
    );
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchGitHubStars(
  owner: string,
  name: string,
  token?: string,
): Promise<number | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${name}`,
      { headers }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const repo = await response.json();
    return repo.stargazers_count;
  } catch {
    return null;
  }
}

export async function fetchUserRepos(token: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=100",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user repos:", error);
    return [];
  }
}

export async function fetchUserOrgs(token: string): Promise<GitHubOrg[]> {
  try {
    const response = await fetch("https://api.github.com/user/orgs", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user orgs:", error);
    return [];
  }
}

export async function fetchOrgRepos(
  org: string,
  token: string,
): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `https://api.github.com/orgs/${org}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching org repos:", error);
    return [];
  }
}
