import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { WidgetDefinition, WidgetCategory } from "./types";
import { getWidgetCategories, getWidgetsByCategory } from "./registry";

interface WidgetSelectorProps {
  onSelectWidget: (widget: WidgetDefinition) => void;
  disabled?: boolean;
}

export function WidgetSelector({
  onSelectWidget,
  disabled,
}: WidgetSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<WidgetCategory>("github");

  const categories = getWidgetCategories();
  const widgets = getWidgetsByCategory(selectedCategory);

  const handleSelectWidget = (widget: WidgetDefinition) => {
    onSelectWidget(widget);
    setOpen(false);
  };

  const getCategoryDisplayName = (category: WidgetCategory): string => {
    const names: Record<WidgetCategory, string> = {
      github: "GitHub",
      analytics: "Analytics",
      notes: "Notes",
      links: "Links",
      custom: "Custom",
    };
    return names[category];
  };

  const getCategoryDescription = (category: WidgetCategory): string => {
    const descriptions: Record<WidgetCategory, string> = {
      github: "Repository metrics and GitHub data",
      analytics: "Charts, graphs, and data visualization",
      notes: "Text notes and documentation",
      links: "Link collections and bookmarks",
      custom: "Custom widgets and integrations",
    };
    return descriptions[category];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} size="sm" className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>
            Choose a widget to add to your board. Widgets can be configured and
            resized after adding.
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-[500px]">
          {/* Category Sidebar */}
          <div className="w-48 border-r pr-4">
            <h3 className="font-medium text-sm mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => {
                const widgetCount = getWidgetsByCategory(category).length;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{getCategoryDisplayName(category)}</span>
                      <span className="text-xs opacity-60">{widgetCount}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Widget Grid */}
          <div className="flex-1 pl-4">
            <div className="mb-4">
              <h3 className="font-medium text-sm mb-1">
                {getCategoryDisplayName(selectedCategory)} Widgets
              </h3>
              <p className="text-xs text-muted-foreground">
                {getCategoryDescription(selectedCategory)}
              </p>
            </div>

            {widgets.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-center">
                <div>
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-sm text-muted-foreground">
                    No widgets available in this category yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[400px]">
                {widgets.map((widget) => (
                  <WidgetCard
                    key={widget.id}
                    widget={widget}
                    onSelect={() => handleSelectWidget(widget)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
      className="p-4 border rounded-lg hover:border-primary hover:shadow-sm transition-all text-left group"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{widget.icon}</div>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
            {widget.name}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {widget.description}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {widget.size.default.width}×{widget.size.default.height}
            </span>
            <span>•</span>
            <span className="capitalize">{widget.category}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
