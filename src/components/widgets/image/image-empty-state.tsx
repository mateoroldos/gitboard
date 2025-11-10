import { useState } from "react";
import { ImageUpload } from "./image-upload";
import { ImageAuthGate } from "./image-auth-gate";
import { useWidget } from "../WidgetProvider";
import type { ImageConfig } from "./types";

export function ImageEmptyState() {
  const { widget, actions } = useWidget<ImageConfig>();
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = (imageKey: string) => {
    actions.updateConfig({ 
      ...widget.config,
      imageKey 
    });
    setError(null);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="w-full h-full">
      <ImageAuthGate>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}
        
        <ImageUpload
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
      </ImageAuthGate>
    </div>
  );
}