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
	owner: string;
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
