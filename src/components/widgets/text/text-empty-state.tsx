import { useState } from "react";
import { useWidget } from "../WidgetProvider";
import { useText } from "./text-context";
import { TextEditor } from "./text-editor";
import { Button } from "../../ui/button";
import type { TextConfig } from "./types";

export function TextEmptyState() {
  const { widget, actions } = useWidget<TextConfig>();
  const { updateOptimisticContent, resetOptimisticContent } = useText();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (content: string) => {
    // Optimistically update the content immediately
    updateOptimisticContent(content);
    setIsEditing(false);

    try {
      // Update the actual config
      await actions.updateConfig({
        ...widget.config,
        content,
      });
      // The optimistic state will be reset automatically when the config updates
    } catch (error) {
      // If the update fails, reset the optimistic state
      resetOptimisticContent();
      console.error("Failed to update text content:", error);
    }
  };

  const handleCancel = () => {
    resetOptimisticContent();
    setIsEditing(false);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="w-full h-full">
        <TextEditor
          initialContent=""
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-black/5 transition-colors"
      onDoubleClick={handleDoubleClick}
      title="Double-click to add text"
    >
      <div className="text-center">
        <div className="text-4xl mb-4">📝</div>
        <div className="text-sm text-muted-foreground mb-4">
          Double-click to add text
        </div>
      </div>
    </div>
  );
}

