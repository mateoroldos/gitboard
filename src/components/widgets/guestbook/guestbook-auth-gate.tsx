import { ReactNode } from "react";
import { Authenticated, Unauthenticated } from "convex/react";

interface GuestbookAuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function GuestbookAuthGate({ children, fallback }: GuestbookAuthGateProps) {
  return (
    <>
      <Authenticated>
        {children}
      </Authenticated>
      <Unauthenticated>
        {fallback || (
          <p className="text-sm text-muted-foreground text-center py-4">
            Sign in to leave a comment in the guestbook
          </p>
        )}
      </Unauthenticated>
    </>
  );
}