import { useSuspenseQuery } from "@tanstack/react-query";
import { convexAction } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";

export function useGitHubStars(owner: string, name: string) {
  const { data: starsData } = useSuspenseQuery(
    convexAction(api.github.getRepoStars, { owner, name }),
  );

  return { stars: starsData?.stars ?? null };
}