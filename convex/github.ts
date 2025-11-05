import { action } from "./_generated/server";
import { authComponent, createAuth } from "./auth";
import * as GitHub from "./model/github";

export const getAllRepos = action({
  handler: async (ctx) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

    const { accessToken } = await auth.api.getAccessToken({
      headers,
      body: {
        providerId: "github",
      },
    });

    return await GitHub.getAllRepos({ accessToken });
  },
});
