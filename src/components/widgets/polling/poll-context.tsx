import { createContext, useContext, useState, ReactNode } from "react";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { convexQuery, convexAction } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { WidgetInstance } from "../types";
import type { PollData, UserVote, PollingConfig } from "./types";
import { useAction } from "convex/react";

export interface PollContextValue {
  pollData: PollData | null;
  userVote: UserVote | null;
  selectedOption: string | null;
  isVoting: boolean;
  hasVoted: boolean;
  totalVotes: number;
  isEditing: boolean;
  actions: {
    selectOption: (id: string) => void;
    vote: () => void;
    clearSelection: () => void;
  };
}

export const PollContext = createContext<PollContextValue | null>(null);

interface PollProviderProps {
  children: ReactNode;
  widget: WidgetInstance<PollingConfig>;
  isEditing?: boolean;
}

export function PollProvider({
  children,
  widget,
  isEditing = false,
}: PollProviderProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { data: pollData } = useSuspenseQuery(
    convexQuery(api.polls.getPollData, { widgetId: widget._id }),
  );

  const { data: userVote } = useQuery({
    ...convexQuery(api.polls.checkUserVote, { widgetId: widget._id }),
    enabled: !!pollData && !isEditing,
  });

  const voteMutation = useMutation({
    mutationFn: useAction(api.polls.vote),
    onSuccess: () => {
      setSelectedOption(null);
    },
  });

  const hasVoted = !!userVote && !isEditing;
  const totalVotes =
    pollData?.options.reduce((sum, option) => sum + option.votes, 0) ?? 0;

  const actions = {
    selectOption: (id: string) => {
      if (!hasVoted && !isEditing) {
        setSelectedOption(id);
      }
    },
    vote: () => {
      if (selectedOption && pollData && !hasVoted && !isEditing) {
        voteMutation.mutate({
          widgetId: widget._id,
          optionId: selectedOption,
        });
      }
    },
    clearSelection: () => {
      setSelectedOption(null);
    },
  };

  const contextValue: PollContextValue = {
    pollData,
    userVote: userVote as UserVote | null,
    selectedOption,
    isVoting: voteMutation.isPending,
    hasVoted,
    totalVotes,
    isEditing,
    actions,
  };

  return (
    <PollContext.Provider value={contextValue}>{children}</PollContext.Provider>
  );
}

export function usePoll() {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error("usePoll must be used within a PollProvider");
  }
  return context;
}

export function usePollActions() {
  const { actions } = usePoll();
  return actions;
}

export function usePollOption(optionId: string) {
  const { pollData, userVote, selectedOption, totalVotes, hasVoted } =
    usePoll();

  const option = pollData?.options.find((opt) => opt.id === optionId);
  const percentage =
    totalVotes > 0 && option ? (option.votes / totalVotes) * 100 : 0;
  const isSelected = selectedOption === optionId;
  const isUserVote = userVote?.optionId === optionId;

  return {
    option,
    percentage,
    isSelected,
    isUserVote,
    hasVoted,
  };
}

export function usePollAuth() {
  const { hasVoted, isEditing } = usePoll();
  return {
    hasVoted,
    isEditing,
    canVote: !hasVoted && !isEditing,
  };
}
