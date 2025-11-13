import { ReactNode } from "react";
import { Authenticated, Unauthenticated } from "convex/react";

interface MapAuthGateProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

export function MapAuthGate({ children, fallback }: MapAuthGateProps) {
  return (
    <>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        {fallback || (
          <p className="text-xs text-muted-foreground text-center">
            Sign in to place a pin
          </p>
        )}
      </Unauthenticated>
    </>
  );
}

