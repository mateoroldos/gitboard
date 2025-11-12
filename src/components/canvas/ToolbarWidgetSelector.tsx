import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import type { WidgetDefinition } from "../widgets/types";
import { getAllWidgets } from "../widgets/registry";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { useAction } from "convex/react";
import { useCanvasContext } from "./CanvasContext";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export function ToolbarWidgetSelector() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { repoString, boardId, viewport, screenToWorld } = useCanvasContext();

  const { mutate: createWidget } = useMutation({
    mutationFn: useAction(api.widgets.createWidgetAction),
  });

  const handleSelectWidget = (widget: WidgetDefinition) => {
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

    setOpen(false);
    setSearch("");
  };

  const allWidgets = getAllWidgets();

  const filteredWidgets = useMemo(() => {
    if (!search.trim()) return allWidgets;

    const searchLower = search.toLowerCase();
    return allWidgets.filter(
      (widget) =>
        widget.name.toLowerCase().includes(searchLower) ||
        widget.description.toLowerCase().includes(searchLower) ||
        widget.category.toLowerCase().includes(searchLower),
    );
  }, [allWidgets, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="flex flex-col items-center rounded group"
          title="Add widget"
        >
          <Plus className="size-4 transition-transform group-hover:-translate-y-[1px]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-90 p-0 rounded"
        align="start"
        side="bottom"
        sideOffset={8}
      >
        <div className="p-4 border-b">
          <h3 className="font-medium text-xs mb-2">Add Widget</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-3 text-muted-foreground" />
            <Input
              placeholder="Search widgets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 !text-xs placeholder:text-xs"
            />
          </div>
        </div>

        <ScrollArea className="h-100 overflow-y-auto">
          {filteredWidgets.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-center p-4">
              <div>
                <div className="text-2xl mb-2">
                  {search.trim() ? "🔍" : "📦"}
                </div>
                <p className="text-sm text-muted-foreground">
                  {search.trim()
                    ? "No widgets found matching your search"
                    : "No widgets available yet"}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {filteredWidgets.map((widget) => (
                <WidgetCard
                  key={widget.id}
                  widget={widget}
                  onSelect={() => handleSelectWidget(widget)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

interface WidgetCardProps {
  widget: WidgetDefinition;
  onSelect: () => void;
}

function WidgetCard({ widget, onSelect }: WidgetCardProps) {
  return (
    <button
      onClick={onSelect}
      className="p-3 rounded hover:bg-accent hover:text-accent-foreground transition-colors text-left group w-full"
    >
      <div className="flex items-start gap-3">
        <div className="bg-primary text-primary-foreground rounded p-1.5 flex-shrink-0">
          {typeof widget.icon === "string" ? (
            <span className="text-sm">{widget.icon}</span>
          ) : (
            <widget.icon className="size-3.5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium mb-1 text-sm group-hover:text-primary transition-colors">
            {widget.name}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-3">
            {widget.description}
          </p>
        </div>
      </div>
    </button>
  );
}
