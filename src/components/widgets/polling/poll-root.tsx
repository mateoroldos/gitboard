import { ReactNode } from "react";
import { PollProvider } from "./poll-context";
import { useWidget } from "../widget/WidgetProvider";
import type { PollingConfig } from "./types";

interface PollRootProps {
  children: ReactNode;
  className?: string;
}

export function PollRoot({ children }: PollRootProps) {
  const { widget, state } = useWidget<PollingConfig>();

  return (
    <PollProvider widget={widget} isEditing={state.isEditing}>
      {children}
    </PollProvider>
  );
}
