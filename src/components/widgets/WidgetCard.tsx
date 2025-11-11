import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useWidget } from "./WidgetProvider";
import { Settings, Trash2 } from "lucide-react";

interface WidgetCardProps {
  children: React.ReactNode;
  className?: string;
}

export function WidgetCard({ children, className }: WidgetCardProps) {
  const { widget, actions, state } = useWidget();

  return (
    <Card className={`group transition-all h-full w-full ${className || ""}`}>
      <CardContent className="h-full w-full">
        {widget.title && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">{widget.title}</h3>
            {!state.isPreview && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!state.isEditing && (
                  <button
                    type="button"
                    onClick={actions.openConfig}
                    className="p-1 hover:bg-accent rounded text-xs transition-colors"
                    aria-label="Edit widget"
                    title="Configure widget"
                  >
                    <Settings className="w-3 h-3" />
                  </button>
                )}
                {!state.isEditing && (
                  <button
                    type="button"
                    onClick={actions.deleteWidget}
                    className="p-1 hover:bg-destructive/10 rounded text-xs transition-colors"
                    aria-label="Delete widget"
                    title="Delete widget"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        <div className="widget-content">{children}</div>
      </CardContent>
    </Card>
  );
}
