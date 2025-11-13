import { createContext, useContext, useState, ReactNode } from "react";
import type { PollData, UserVote } from "./types";
import { usePollStats, usePollAuth } from "./hooks/usePollComputed";

export interface PollStateContextValue {
  pollData: PollData;
  userVote: UserVote | null;
  selectedOption: string | null;
  isVoting: boolean;
  isEditing: boolean;
  totalVotes: number;
  hasVoted: boolean;
  canVote: boolean;
  actions: {
    selectOption: (id: string) => void;
    vote: () => void;
    clearSelection: () => void;
  };
}

export const PollStateContext = createContext<PollStateContextValue | null>(
  null,
);

export interface PollStateProviderProps {
  children: ReactNode;
  pollData: PollData;
  userVote?: UserVote | null;
  isEditing?: boolean;
  isVoting?: boolean;
  onVote?: (optionId: string) => Promise<void>;
}

export function PollStateProvider({
  children,
  pollData,
  userVote = null,
  isEditing = false,
  isVoting = false,
  onVote,
}: PollStateProviderProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { totalVotes } = usePollStats(pollData);
  const { hasVoted, canVote } = usePollAuth(userVote, isEditing);

  const actions = {
    selectOption: (id: string) => {
      if (canVote) {
        setSelectedOption(id);
      }
    },
    vote: async () => {
      if (selectedOption && canVote && onVote) {
        try {
          await onVote(selectedOption);
          setSelectedOption(null);
        } catch (error) {
          // Error handling can be done by the parent component
          console.error("Vote failed:", error);
        }
      }
    },
    clearSelection: () => {
      setSelectedOption(null);
    },
  };

  const contextValue: PollStateContextValue = {
    pollData,
    userVote,
    selectedOption,
    isVoting,
    isEditing,
    totalVotes,
    hasVoted,
    canVote,
    actions,
  };

  return (
    <PollStateContext.Provider value={contextValue}>
      {children}
    </PollStateContext.Provider>
  );
}

export function usePoll() {
  const context = useContext(PollStateContext);
  if (!context) {
    throw new Error("usePollState must be used within a PollStateProvider");
  }
  return context;
}

