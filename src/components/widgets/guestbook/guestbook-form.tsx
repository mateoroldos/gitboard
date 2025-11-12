import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGuestbook } from "./guestbook-context";
import { Loader } from "lucide-react";

export function GuestbookForm() {
  const [comment, setComment] = useState("");
  const { userStatus, isSubmitting, actions } = useGuestbook();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && userStatus?.canComment) {
      actions.addComment(comment.trim());
      setComment("");
    }
  };

  const remainingComments = userStatus ? 5 - userStatus.commentCount : 0;
  const canComment = userStatus?.canComment && comment.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment in the guestbook..."
          className="min-h-[80px] resize-none"
          maxLength={280}
          disabled={!userStatus?.canComment || isSubmitting}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {userStatus?.canComment
              ? `${remainingComments} comment${remainingComments === 1 ? "" : "s"} remaining`
              : "Maximum comments reached (5)"}
          </span>
          <span>{comment.length}/280</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!canComment || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? <Loader className="animate-spin" /> : ""}
        Post Comment
      </Button>
    </form>
  );
}

