import { ReactNode } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { useWidget } from "../WidgetProvider";

interface ImageAuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ImageAuthGate({ children, fallback }: ImageAuthGateProps) {
  const { state } = useWidget();

  return (
    <>
      <Authenticated>
        {state.hasWriteAccess
          ? children
          : fallback || (
              <div className="flex items-center justify-center w-full h-full">
                <div className="text-center">
                  <div className="text-4xl mb-2">🔒</div>
                  <div className="text-sm">
                    No write access to this repository
                  </div>
                  <div className="text-xs mt-1">
                    You can view but not upload images
                  </div>
                </div>
              </div>
            )}
      </Authenticated>

      <Unauthenticated>
        {fallback || (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">👤</div>
              <div className="text-sm">No write access to this repository</div>
            </div>
          </div>
        )}
      </Unauthenticated>
    </>
  );
}

