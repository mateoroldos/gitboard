import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { betterAuth, env } from "better-auth";
import { action, query } from "./_generated/server";
import { v } from "convex/values";
import * as Auth from "./model/auth";

const siteUrl = env.SITE_URL;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    account: {
      encryptOAuthTokens: true,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID as string,
        clientSecret: env.GITHUB_CLIENT_SECRET as string,
      },
    },
    plugins: [convex()],
  });
};

export const checkRepoWriteAccess = action({
  args: {
    repo: v.string(),
  },
  handler: async (ctx, { repo }) => {
    try {
      await Auth.requireRepoAccess(ctx, repo);

      return true;
    } catch {
      return false;
    }
  },
});

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    try {
      const user = await Auth.requireSession(ctx);

      return user;
    } catch (error) {
      return null;
    }
  },
});
