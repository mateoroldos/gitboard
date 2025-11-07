import type { WidgetProps } from "../types";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { convexQuery, convexAction } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { useState } from "react";
import { PollingDisplay } from "./PollingDisplay";

interface PollingConfig {
  question: string;
  options: string;
  showPercentages: boolean;
}

export function PollingWidget({
  config,
  instanceId,
  onConfigChange,
  onDelete,
}: WidgetProps<PollingConfig>) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: pollData } = useSuspenseQuery(
    convexQuery(api.polls.getPollData, { widgetId: instanceId as any })
  );

  const { data: userVote } = useQuery({
    ...convexQuery(api.polls.checkUserVote, { widgetId: instanceId as any }),
    enabled: !!pollData,
  });

  const voteMutation = useMutation({
    mutationFn: async (variables: { widgetId: any; optionId: string }) => {
      const action = convexAction(api.polls.vote, variables);
      return await queryClient.fetchQuery(action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setSelectedOption(null);
    },
  });

  const handleVote = () => {
    if (selectedOption && pollData) {
      voteMutation.mutate({
        widgetId: instanceId,
        optionId: selectedOption,
      });
    }
  };

  return (
    <PollingDisplay
      pollData={pollData}
      userVote={userVote}
      selectedOption={selectedOption}
      onOptionSelect={setSelectedOption}
      onVote={handleVote}
      onEdit={onConfigChange ? () => onConfigChange(config) : undefined}
      onDelete={onDelete}
      isVoting={voteMutation.isPending}
    />
  );
}
