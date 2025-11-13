import { useRef, useEffect, useState, useCallback } from "react";
import { useWidget } from "../widget/WidgetProvider";
import { TextEditor } from "./text-editor";
import {
  getFontFamilyClass,
  getTextAlignClass,
  getFontWeightClass,
  calculateOptimalFontSize,
  getLineHeight,
} from "./utils";
import { createTextDataFromConfig } from "./utils";
import type { TextConfig } from "./types";

export function TextDisplay() {
  const { widget, actions, state } = useWidget<TextConfig>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);
  const [isEditing, setIsEditing] = useState(false);

  const textData = createTextDataFromConfig(widget.config);

  const updateFontSize = useCallback(() => {
    if (!containerRef.current || !textData) return;

    const containerWidth = widget.size.width;
    const containerHeight = widget.size.height;

    if (containerWidth <= 0 || containerHeight <= 0) return;

    // For empty content, use a reasonable default
    const content = textData.content || "Sample Text";

    const newFontSize = calculateOptimalFontSize(
      content,
      containerWidth,
      containerHeight,
      textData.fontScale,
      textData.fontFamily,
      textData.fontWeight,
      textData.padding,
    );

    setFontSize(newFontSize);
  }, [textData, widget.size.width, widget.size.height]);

  useEffect(() => {
    if (!containerRef.current || !textData) return;

    // Initial calculation with a small delay to ensure DOM is ready
    const timer = setTimeout(updateFontSize, 10);

    // Watch for container size changes
    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize calculations
      setTimeout(updateFontSize, 10);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [updateFontSize]);

  if (!textData) {
    return null;
  }

  const fontFamilyClass = getFontFamilyClass(textData.fontFamily);
  const textAlignClass = getTextAlignClass(textData.textAlign);
  const fontWeightClass = getFontWeightClass(textData.fontWeight);

  const lineHeight = getLineHeight(fontSize);

  const style = {
    backgroundColor:
      textData.backgroundColor !== "transparent"
        ? textData.backgroundColor
        : undefined,
    padding: `${textData.padding}px`,
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeight}px`,
  };

  const handleDoubleClick = () => {
    if (!state.isPreview) {
      setIsEditing(true);
    }
  };

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

  if (isEditing) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ padding: `${textData.padding}px` }}
      >
        <TextEditor
          initialContent={textData.content}
          onSave={handleSave}
          onCancel={handleCancel}
          style={{
            fontSize: `${fontSize}px`,
          }}
          className={`${fontFamilyClass} ${textAlignClass} ${fontWeightClass}`}
        />
      </div>
    );
  }

  // Determine if we should center vertically based on content
  const shouldCenterVertically =
    !textData.content || textData.content.split("\n").length === 1;

  return (
    <div
      ref={containerRef}
      className={`w-full h-full text-foreground ${fontFamilyClass} ${textAlignClass} ${fontWeightClass} whitespace-pre-wrap break-words cursor-pointer hover:bg-accent/20 transition-colors ${shouldCenterVertically ? "flex items-center" : "flex flex-col justify-center"}`}
      style={style}
      onDoubleClick={handleDoubleClick}
      title={state.isPreview ? undefined : "Double-click to edit"}
    >
      {textData.content || "Double-click to add text..."}
    </div>
  );
}
