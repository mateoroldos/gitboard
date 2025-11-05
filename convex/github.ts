import { fetchUserRepos, fetchUserOrgs, fetchOrgRepos } from "@/lib/github";
import { action } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

export const getAllRepos = action({
  handler: async (ctx) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

    const { accessToken } = await auth.api.getAccessToken({
      headers,
      body: {
        providerId: "github",
      },
    });

    try {
      const [userRepos, organizations] = await Promise.all([
        fetchUserRepos(accessToken),
        fetchUserOrgs(accessToken),
      ]);

      const orgReposPromises = organizations.map((org) =>
        fetchOrgRepos(org.login, accessToken),
      );
      const orgReposArrays = await Promise.all(orgReposPromises);
      const orgRepos = orgReposArrays.flat();

      return {
        userRepos,
        orgRepos,
        organizations,
      };
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      return {
        userRepos: [],
        orgRepos: [],
        organizations: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch GitHub data",
      };
    }
  },
});
