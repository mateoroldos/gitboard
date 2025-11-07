import { action, internalAction } from "./_generated/server";
import { getAccessToken } from "./model/auth";
import * as GitHub from "./model/github";
import { fetchGitHubStars } from "@/lib/github";
import { ActionCache } from "@convex-dev/action-cache";
import { components } from "./_generated/api";
import { v } from "convex/values";
import { internal } from "./_generated/api";

const allReposCache = new ActionCache(components.actionCache, {
  action: internal.github.fetchAllRepos,
  name: "github-repos-v1",
  ttl: 1000 * 60, // 1 min cache
});

export const fetchAllRepos = internalAction({
  args: {
    accessToken: v.string(),
  },
  handler: async (_, { accessToken }) => {
    return await GitHub.getAllRepos({ accessToken });
  },
});

export const getAllRepos = action({
  handler: async (ctx): ReturnType<typeof GitHub.getAllRepos> => {
    const accessToken = await getAccessToken(ctx);

    return await allReposCache.fetch(ctx, { accessToken });
  },
});

const starsCache = new ActionCache(components.actionCache, {
  action: internal.github.fetchRepoStars,
  name: "github-stars-v1",
  ttl: 1000 * 60 * 60, // 1 hour cache
});

export const fetchRepoStars = internalAction({
  args: { owner: v.string(), name: v.string(), token: v.optional(v.string()) },
  handler: async (_, { owner, name, token }) => {
    const stars = await fetchGitHubStars(owner, name, token);
    if (stars === null) {
      throw new Error(`Failed to fetch stars for ${owner}/${name}`);
    }
    return { stars, repository: `${owner}/${name}` };
  },
});

export const getRepoStars = action({
  args: { owner: v.string(), name: v.string() },
  handler: async (
    ctx,
    { owner, name },
  ): Promise<{ stars: number; repository: string } | null> => {
    try {
      // Try to get access token for authenticated requests (higher rate limits)
      let accessToken: string | undefined;
      try {
        accessToken = await getAccessToken(ctx);
      } catch {
        // No access token available, proceed with unauthenticated request
      }

      const result = await starsCache.fetch(ctx, {
        owner,
        name,
        token: accessToken,
      });

      return result;
    } catch (error) {
      console.error(`Error fetching stars for ${owner}/${name}:`, error);
      // Return null to allow graceful handling in the UI
      return null;
    }
  },
});
