import { ReactNode } from "react";
import { GuestbookProvider } from "./guestbook-context";
import { useWidget } from "../WidgetProvider";
import type { GuestbookConfig } from "./types";

interface GuestbookRootProps {
  children: ReactNode;
  className?: string;
}

export function GuestbookRoot({ children, className }: GuestbookRootProps) {
  const { widget, state } = useWidget<GuestbookConfig>();

  return (
    <div className={className}>
      <GuestbookProvider widget={widget} isEditing={state.isEditing}>
        {children}
      </GuestbookProvider>
    </div>
  );
}