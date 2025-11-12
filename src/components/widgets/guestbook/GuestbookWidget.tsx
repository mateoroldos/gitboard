import { GuestbookRoot } from "./guestbook-root";
import { GuestbookCard } from "./guestbook-card";
import { GuestbookModal } from "./guestbook-modal";

export function GuestbookWidget() {
  return (
    <GuestbookRoot>
      <GuestbookCard />
      <GuestbookModal />
    </GuestbookRoot>
  );
}