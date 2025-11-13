import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useWidget } from "./WidgetProvider";

interface WidgetCardProps {
  children: React.ReactNode;
  className?: string;
}

export function WidgetCard({ children, className }: WidgetCardProps) {
  const { widget } = useWidget();

  return (
    <Card
      className={`group transition-all h-full w-full overflow-hidden ${className || ""}`}
    >
      <CardContent className="h-full w-full flex flex-col">
        {widget.title && (
          <div className="py-0.5 border-t border flex bg-secondary px-2 w-fit rounded text-secondary-foreground items-center justify-between mb-3">
            <h3 className="font-medium text-xs">{widget.title}</h3>
          </div>
        )}
        <div className="overflow-hidden flex flex-1">{children}</div>
      </CardContent>
    </Card>
  );
}
