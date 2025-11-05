import { parseRepoString } from "@/lib/github";
import { ActionCtx } from "convex/_generated/server";
import { authComponent, createAuth } from "convex/auth";

export async function requireRepoAccess(ctx: ActionCtx, repo: string) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new Error("Not authenticated");
  }

  const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

  const { accessToken } = await auth.api.getAccessToken({
    headers,
    body: {
      providerId: "github",
    },
  });

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

  if (!repoResponse.ok) {
    throw new Error("No access to repository");
  }

  const repoData = await repoResponse.json();

  // Check if user has write access (push or admin permissions)
  if (!repoData.permissions?.push && !repoData.permissions?.admin) {
    throw new Error(
      "Insufficient repository permissions - write access required",
    );
  }

  return { repo };
}
