import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2, Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAction } from "convex/react";
import { api } from "convex/_generated/api";
import type { GuestbookComment } from "./types";
import { toast } from "sonner";
import { useCanvasContext } from "@/components/canvas/CanvasContext";
import { Id } from "convex/_generated/dataModel";

interface GuestbookCommentProps {
  comment: GuestbookComment;
}

export function GuestbookCommentComponent({ comment }: GuestbookCommentProps) {
  const { hasWriteAccess } = useCanvasContext();

  const deleteCommentAction = useAction(api.guestbook.deleteComment);
  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentAction,
    onSuccess: () => toast.success("Comment deleted"),
  });

  const handleDelete = () => {
    deleteCommentMutation.mutate({
      commentId: comment._id as Id<"guestbookComments">,
    });
  };

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
      {hasWriteAccess && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={deleteCommentMutation.isPending}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive disabled:opacity-50"
        >
          {deleteCommentMutation.isPending ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}
