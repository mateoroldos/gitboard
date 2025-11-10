import { ReactNode } from "react";
import { Authenticated, Unauthenticated } from "convex/react";

interface PollAuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function PollAuthGate({ children, fallback }: PollAuthGateProps) {
  return (
    <>
      <Authenticated>
        {children}
      </Authenticated>
      <Unauthenticated>
        {fallback || (
          <p className="text-xs text-muted-foreground text-center">
            Sign in to vote
          </p>
        )}
      </Unauthenticated>
    </>
  );
}