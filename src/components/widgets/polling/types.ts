export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  showPercentages: boolean;
}

export interface UserVote {
  optionId: string;
}

export interface PollingConfig {
  question: string;
  options: string;
  showPercentages: boolean;
}

