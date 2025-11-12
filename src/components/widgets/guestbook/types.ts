export interface GuestbookComment {
  _id: string;
  comment: string;
  createdAt: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
}

export interface GuestbookData {
  page: GuestbookComment[];
  isDone: boolean;
  continueCursor: string | null;
}

export interface UserCommentStatus {
  canComment: boolean;
  commentCount: number;
}
