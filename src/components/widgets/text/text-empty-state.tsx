import { useState } from "react";
import { useWidget } from "../widget/WidgetProvider";
import { TextEditor } from "./text-editor";
import type { TextConfig } from "./types";

export function TextEmptyState() {
  const { widget, actions } = useWidget<TextConfig>();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (content: string) => {
    setIsEditing(false);
    actions.updateConfig({
      ...widget.config,
      content,
    });
  };

  const handleCancel = () => {
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

