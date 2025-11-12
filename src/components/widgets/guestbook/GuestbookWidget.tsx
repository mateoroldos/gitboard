import { Suspense } from "react";
import { GuestbookRoot } from "./guestbook-root";
import { GuestbookCard } from "./guestbook-card";
import { GuestbookModal } from "./guestbook-modal";
import { GuestbookSkeleton } from "./guestbook-skeleton";

export function GuestbookWidget() {
  return (
    <GuestbookRoot>
      <Suspense fallback={<GuestbookSkeleton />}>
        <GuestbookCard />
      </Suspense>
      <GuestbookModal />
    </GuestbookRoot>
  );
}