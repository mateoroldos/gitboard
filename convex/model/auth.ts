import { parseRepoString } from "@/lib/github";
import { ActionCtx } from "convex/_generated/server";
import { authComponent, createAuth } from "convex/auth";
import { ConvexError } from "convex/values";

export async function requireSession(ctx: ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new ConvexError({
      message: "Unauthorized",
      code: 401,
    });
  }
}

export async function getAccessToken(ctx: ActionCtx) {
  const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

  const { accessToken } = await auth.api.getAccessToken({
    headers,
    body: {
      providerId: "github",
    },
  });

  if (!accessToken) {
    throw new ConvexError({
      message: "Unauthorized",
      code: 401,
    });
  }

  return accessToken;
}

export async function requireRepoAccess(ctx: ActionCtx, repo: string) {
  const accessToken = await getAccessToken(ctx);

  const { owner, name } = parseRepoString(repo);

  const repoResponse = await fetch(
    `https://api.github.com/repos/${owner}/${name}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  if (!repoResponse.ok && repoResponse.status === 404) {
    throw new ConvexError({
      message: "Repo not found",
      code: 404,
    });
  }

  if (!repoResponse.ok) {
    throw new ConvexError({
      message: "Internal Error",
      code: 500,
    });
  }

  const repoData = await repoResponse.json();

  // Check if user has write access (push or admin permissions)
  if (!repoData.permissions?.push && !repoData.permissions?.admin) {
    throw new ConvexError({
      message: "You don't have write access to this repo",
      code: 401,
    });
  }

  return { repo };
}
