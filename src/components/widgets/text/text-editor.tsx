import { useState, useRef, useEffect } from "react";
import { useWidget } from "../widget/WidgetProvider";
import { Textarea } from "../../ui/textarea";
import type { TextConfig } from "./types";

interface TextEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function TextEditor({ 
  initialContent, 
  onSave, 
  onCancel, 
  style,
  className 
}: TextEditorProps) {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSave(content);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    onSave(content);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={content}
      onChange={(e) => setContent(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={`w-full h-full resize-none border-none outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      style={{
        ...style,
        background: "transparent",
      }}
      placeholder="Enter your text here..."
    />
  );
}
