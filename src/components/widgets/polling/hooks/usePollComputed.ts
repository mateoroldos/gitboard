import { useMemo } from "react";
import type { PollData, UserVote, PollOption } from "../types";

export interface PollStats {
  totalVotes: number;
  percentages: Array<{
    id: string;
    percentage: number;
  }>;
}

export function usePollStats(pollData: PollData | null): PollStats {
  return useMemo(() => {
    if (!pollData) {
      return {
        totalVotes: 0,
        percentages: [],
      };
    }

    const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0);
    const percentages = pollData.options.map((option) => ({
      id: option.id,
      percentage: totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0,
    }));

    return {
      totalVotes,
      percentages,
    };
  }, [pollData]);
}

export interface PollOptionData {
  option: PollOption | undefined;
  percentage: number;
  isUserVote: boolean;
  votes: number;
}

export function usePollOption(
  optionId: string,
  pollData: PollData | null,
  userVote: UserVote | null = null
): PollOptionData {
  return useMemo(() => {
    if (!pollData) {
      return {
        option: undefined,
        percentage: 0,
        isUserVote: false,
        votes: 0,
      };
    }

    const option = pollData.options.find((opt) => opt.id === optionId);
    
    // Calculate stats directly instead of using hook
    const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);
    const percentage = totalVotes > 0 && option ? (option.votes / totalVotes) * 100 : 0;
    const isUserVote = userVote?.optionId === optionId;

    return {
      option,
      percentage,
      isUserVote,
      votes: option?.votes ?? 0,
    };
  }, [optionId, pollData, userVote]);
}

export interface PollAuthState {
  hasVoted: boolean;
  canVote: boolean;
  isEditing: boolean;
}

export function usePollAuth(
  userVote: UserVote | null,
  isEditing: boolean = false
): PollAuthState {
  return useMemo(() => {
    const hasVoted = !!userVote && !isEditing;
    const canVote = !hasVoted && !isEditing;

    return {
      hasVoted,
      canVote,
      isEditing,
    };
  }, [userVote, isEditing]);
}