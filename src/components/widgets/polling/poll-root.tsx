import { ReactNode } from "react";
import { PollProvider } from "./poll-context";
import { useWidget } from "../WidgetProvider";
import type { PollingConfig } from "./types";

interface PollRootProps {
  children: ReactNode;
  className?: string;
}

export function PollRoot({ children, className }: PollRootProps) {
  const { widget, state } = useWidget<PollingConfig>();

  return (
    <div className={className}>
      <PollProvider widget={widget} isEditing={state.isEditing}>
        {children}
      </PollProvider>
    </div>
  );
}
