import { action } from "./_generated/server";
import { getAccessToken } from "./model/auth";
import * as GitHub from "./model/github";

export const getAllRepos = action({
  handler: async (ctx) => {
    const accessToken = await getAccessToken(ctx);

    return await GitHub.getAllRepos({ accessToken });
  },
});
