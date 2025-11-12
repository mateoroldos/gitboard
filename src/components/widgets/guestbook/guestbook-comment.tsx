import { formatDistanceToNow } from "date-fns";
import type { GuestbookComment } from "./types";

interface GuestbookCommentProps {
  comment: GuestbookComment;
}

export function GuestbookCommentComponent({ comment }: GuestbookCommentProps) {
  return (
    <div className="flex gap-3 p-4 border-b border-border/50 last:border-b-0">
      <img
        src={comment.avatarUrl || undefined}
        alt={comment.username}
        className="w-10 h-10 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-xs">{comment.username}</span>
          <span className="text-xs text-muted-foreground/80">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <p className="text-sm text-foreground break-words">{comment.comment}</p>
      </div>
    </div>
  );
}

