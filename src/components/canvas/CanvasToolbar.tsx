import { Button } from "@/components/ui/button";
import { Image, Type, Vote } from "lucide-react";
import { useCanvasContext } from "./CanvasContext";
import { ToolbarWidgetSelector } from "./ToolbarWidgetSelector";
import { imageWidget } from "../widgets/image";
import { textWidget } from "../widgets/text";
import type { WidgetDefinition } from "../widgets/types";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { useAction } from "convex/react";
import { pollingWidget } from "../widgets/polling";

interface ToolbarItemProps {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
}

function ToolbarItem({ icon, label, onClick }: ToolbarItemProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex rounded group flex-col items-center gap-1 size-7 p-1 hover:bg-primary-foreground/10 hover:text-primary-foreground"
      onClick={onClick}
      title={label}
    >
      <div className="text-lg transition-transform group-hover:-translate-y-[1px]">
        {icon}
      </div>
      {label && <span className="text-xs font-medium">{label}</span>}
    </Button>
  );
}

export function CanvasToolbar() {
  const { hasWriteAccess, repoString, boardId, viewport, screenToWorld } =
    useCanvasContext();

  const { mutate: createWidget } = useMutation({
    mutationFn: useAction(api.widgets.createWidgetAction),
  });

  if (!hasWriteAccess) {
    return null;
  }

  const handleCreateWidget = (widget: WidgetDefinition) => {
    // Place new widget in the center of the current viewport
    const centerScreen = { x: viewport.width / 2, y: viewport.height / 2 };
    const centerWorld = screenToWorld(centerScreen);

    // Offset slightly to avoid overlapping widgets
    const randomOffset = () => Math.random() * 100 - 50;
    const position = {
      x: Math.round(centerWorld.x + randomOffset()),
      y: Math.round(centerWorld.y + randomOffset()),
    };

    createWidget({
      boardId: boardId,
      widgetType: widget.id,
      config: { ...widget.defaultConfig, repository: repoString },
      position,
      size: widget.size.default,
      title: widget.name,
    });
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-row gap-2">
      <div className="bg-primary rounded shadow-lg py-1 px-2 text-primary-foreground">
        <div className="flex items-center gap-2">
          <ToolbarItem
            icon={<Image className="size-4" />}
            onClick={() => handleCreateWidget(imageWidget)}
          />

          <ToolbarItem
            icon={<Type className="size-4" />}
            onClick={() => handleCreateWidget(textWidget)}
          />

          <div className="w-px h-4 bg-border/20 mx-1" />

          <ToolbarItem
            icon={<Vote className="size-4" />}
            onClick={() => handleCreateWidget(pollingWidget)}
          />
        </div>
      </div>
      <ToolbarWidgetSelector />
    </div>
  );
}

