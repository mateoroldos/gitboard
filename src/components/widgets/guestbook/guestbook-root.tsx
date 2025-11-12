import { ReactNode } from "react";
import { GuestbookProvider } from "./guestbook-context";
import { useWidget } from "../WidgetProvider";

interface GuestbookRootProps {
  children: ReactNode;
}

export function GuestbookRoot({ children }: GuestbookRootProps) {
  const { widget, state } = useWidget();

  return (
    <GuestbookProvider widget={widget} isEditing={state.isEditing}>
      {children}
    </GuestbookProvider>
  );
}

