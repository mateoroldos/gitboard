import { useRef, useEffect, useState, useCallback } from "react";
import { useText } from "./text-context";
import { useWidget } from "../WidgetProvider";
import { TextEditor } from "./text-editor";
import {
  getFontFamilyClass,
  getTextAlignClass,
  getFontWeightClass,
  calculateOptimalFontSize,
  getLineHeight,
} from "./utils";
import type { TextConfig } from "./types";

export function TextDisplay() {
  const {
    textData,
    isEditing: isPreviewMode,
    updateOptimisticContent,
    resetOptimisticContent,
  } = useText();
  const { widget, actions } = useWidget<TextConfig>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = useCallback(() => {
    if (!containerRef.current || !textData) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

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
      textData.padding
    );
    
    setFontSize(newFontSize);
  }, [textData]);

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
    color: textData.textColor,
    backgroundColor:
      textData.backgroundColor !== "transparent"
        ? textData.backgroundColor
        : undefined,
    padding: `${textData.padding}px`,
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeight}px`,
  };

  const handleDoubleClick = () => {
    if (!isPreviewMode) {
      setIsEditing(true);
    }
  };

  const handleSave = async (content: string) => {
    // Optimistically update the content immediately
    updateOptimisticContent(content);
    setIsEditing(false);

    try {
      // Update the actual config
      actions.updateConfig({
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
            color: textData.textColor,
            fontSize: `${fontSize}px`,
          }}
          className={`${fontFamilyClass} ${textAlignClass} ${fontWeightClass}`}
        />
      </div>
    );
  }

  // Determine if we should center vertically based on content
  const shouldCenterVertically = !textData.content || textData.content.split('\n').length === 1;

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${fontFamilyClass} ${textAlignClass} ${fontWeightClass} whitespace-pre-wrap break-words cursor-pointer hover:bg-black/5 transition-colors ${shouldCenterVertically ? 'flex items-center' : 'flex flex-col justify-center'}`}
      style={style}
      onDoubleClick={handleDoubleClick}
      title={isPreviewMode ? undefined : "Double-click to edit"}
    >
      {textData.content || "Double-click to add text..."}
    </div>
  );
}

