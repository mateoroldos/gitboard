import { fetchUserRepos, fetchUserOrgs, fetchOrgRepos } from "@/lib/github";

export async function getAllRepos({ accessToken }: { accessToken: string }) {
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
    // Catch errors and throw empty data - we will allow users to type repos manually
    console.error("Error fetching GitHub data:", error);
    return {
      userRepos: [],
      orgRepos: [],
      organizations: [],
    };
  }
}
