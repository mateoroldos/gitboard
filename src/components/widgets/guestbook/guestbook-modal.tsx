import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useGuestbook } from "./guestbook-context";
import { GuestbookCommentComponent } from "./guestbook-comment";
import { GuestbookForm } from "./guestbook-form";
import { GuestbookAuthGate } from "./guestbook-auth-gate";
import { GuestbookEmptyState } from "./guestbook-empty-state";

export function GuestbookModal() {
  const { comments, isModalOpen, actions, status } = useGuestbook();

  const hasComments = comments && comments.length > 0;

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => !open && actions.closeModal()}
    >
      <DialogContent className="!max-w-3xl !h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Guestbook</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {!hasComments ? (
            <GuestbookEmptyState />
          ) : (
            <div className="flex flex-col min-h-0">
              <div className="min-h-[400px] flex-1 border overflow-y-auto">
                <div className="space-y-0">
                  {comments.map((comment: any) => (
                    <GuestbookCommentComponent
                      key={comment._id}
                      comment={comment}
                    />
                  ))}
                </div>
              </div>

              {status === "CanLoadMore" && (
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => actions.loadMore(20)}
                    className="w-full"
                  >
                    Load More Comments
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t mt-4">
            <GuestbookAuthGate>
              <GuestbookForm />
            </GuestbookAuthGate>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

