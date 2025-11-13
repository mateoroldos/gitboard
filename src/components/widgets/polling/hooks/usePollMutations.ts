import { useMutation } from "@tanstack/react-query";
import { useAction } from "convex/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

export interface VoteMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePollVoteMutation(options: VoteMutationOptions = {}) {
  const voteAction = useAction(api.polls.vote);

  return useMutation({
    mutationFn: async ({ widgetId, optionId }: { widgetId: Id<"widgets">; optionId: string }) => {
      return await voteAction({ widgetId, optionId });
    },
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
}