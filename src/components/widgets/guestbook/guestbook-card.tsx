import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";
import { useGuestbook } from "./guestbook-context";
import { GuestbookSkeleton } from "./guestbook-skeleton";

export function GuestbookCard() {
  const { stats, actions, isEditing, isStatsLoading } = useGuestbook();

  if (isStatsLoading) {
    return <GuestbookSkeleton />;
  }

  const commentCount = stats?.totalComments || 0;
  const uniqueUsers = stats?.uniqueUsers || 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            {commentCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>
                  {commentCount} {commentCount === 1 ? "comment" : "comments"}
                </span>
              </div>
            )}
            {uniqueUsers > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>
                  {uniqueUsers} {uniqueUsers === 1 ? "visitor" : "visitors"}
                </span>
              </div>
            )}
          </div>

          {commentCount === 0 ? (
            <p className="text-muted-foreground text-sm">
              Be the first to sign the guestbook!
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Latest visitors have left their mark
              </p>
              <div className="flex justify-center -space-x-2">
                {stats?.recentAvatars
                  ?.slice(0, 3)
                  .map((avatar, index: number) => (
                    <img
                      key={avatar._id}
                      src={avatar.avatarUrl || ''}
                      alt={avatar.username}
                      className="size-10 rounded-full border-2 border-background"
                      style={{ zIndex: 3 - index }}
                    />
                  ))}
                {commentCount > 3 && (
                  <div className="size-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
                    +{commentCount - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={actions.openModal}
        className="w-full mt-4"
        disabled={isEditing}
      >
        {commentCount === 0 ? "Sign Guestbook" : "View Guestbook"}
      </Button>
    </div>
  );
}

