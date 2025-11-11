import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWidget } from "./WidgetProvider";
import { useCanvasContext } from "../canvas/CanvasContext";
import { Settings, Trash2 } from "lucide-react";

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
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">{widget.title}</h3>
          </div>
        )}
        <div className="overflow-hidden">{children}</div>
      </CardContent>
    </Card>
  );
}
