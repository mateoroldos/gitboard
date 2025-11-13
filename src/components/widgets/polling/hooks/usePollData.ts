import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

export function usePollData(widgetId: Id<"widgets">) {
  const { data: pollQuery } = useQuery(
    convexQuery(api.polls.getPollData, { widgetId }),
  );

  const { data: userVoteQuery } = useQuery(
    convexQuery(api.polls.checkUserVote, { widgetId }),
  );

  return {
    pollData: pollQuery ?? null,
    userVote: userVoteQuery ?? null,
  };
}

