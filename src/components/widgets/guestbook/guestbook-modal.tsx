import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { useGuestbook } from "./guestbook-context";
import { GuestbookCommentComponent } from "./guestbook-comment";
import { GuestbookForm } from "./guestbook-form";
import { GuestbookAuthGate } from "./guestbook-auth-gate";
import { GuestbookEmptyState } from "./guestbook-empty-state";

export function GuestbookModal() {
  const { comments, isModalOpen, actions, loadMoreRef, status } = useGuestbook();

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
                  {status === "LoadingMore" && (
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  )}
                  <div ref={loadMoreRef} className="h-1" />
                </div>
              </div>
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

