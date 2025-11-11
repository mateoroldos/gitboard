import React, { useState, useRef } from "react";
import {
  MessageSquare,
  Eye,
  Upload,
  Maximize,
  Minimize,
  Square,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWidget } from "../WidgetProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUploadFile } from "@convex-dev/r2/react";
import { api } from "convex/_generated/api";
import { isValidImageFile } from "./utils";
import { toast } from "sonner";

export function ImageEditingOverlay() {
  const { widget, actions } = useWidget();
  const config = widget.config;
  const [altTextOpen, setAltTextOpen] = useState(false);
  const [captionOpen, setCaptionOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFile = useUploadFile(api.image);

  const updateConfig = (updates: Partial<typeof config>) => {
    actions.updateConfigDebounced({ ...config, ...updates });
  };

  const fitOptions = [
    { value: "contain", icon: Minimize, label: "Contain" },
    { value: "cover", icon: Maximize, label: "Cover" },
    { value: "fill", icon: Square, label: "Fill" },
  ];

  const handleReplaceImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast.error("Invalid file type", {
        description:
          "Please select a valid image file (JPEG, PNG, GIF, SVG, or WebP)",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error("File too large", {
        description: "File size must be less than 10MB",
      });
      return;
    }

    setIsUploading(true);

    try {
      const imageKey = await uploadFile(file);

      // Update the widget config with the new image
      updateConfig({ imageKey });

      toast.success("Image replaced successfully!");
    } catch (error) {
      toast.error("Upload failed", {
        description:
          error instanceof Error ? error.message : "Failed to upload image",
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      {/* Top toolbar */}
      <div className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-1 pointer-events-auto">
          {/* Alt Text */}
          <Popover open={altTextOpen} onOpenChange={setAltTextOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={config.altText ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2"
              >
                <Eye className="h-4 w-4 mr-1" />
                Alt Text
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Alt Text</h4>
                <p className="text-xs text-gray-600">
                  Describe the image for accessibility and screen readers
                </p>
                <Input
                  placeholder="Describe the image..."
                  value={config.altText || ""}
                  onChange={(e) => updateConfig({ altText: e.target.value })}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Caption */}
          <Popover open={captionOpen} onOpenChange={setCaptionOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={config.title ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Caption
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Image Caption</h4>
                <p className="text-xs text-gray-600">
                  Optional caption displayed over the image
                </p>
                <Input
                  placeholder="Enter caption..."
                  value={config.title || ""}
                  onChange={(e) => updateConfig({ title: e.target.value })}
                />
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Image Fit */}
          <div className="flex">
            {fitOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={option.value}
                  variant={config.fit === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => updateConfig({ fit: option.value as any })}
                  className="h-8 w-8 p-0"
                  title={option.label}
                >
                  <IconComponent className="h-4 w-4" />
                </Button>
              );
            })}
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Border Radius */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">Radius:</span>
            <Input
              type="number"
              min="0"
              max="50"
              value={config.borderRadius || 0}
              onChange={(e) =>
                updateConfig({
                  borderRadius: parseInt(e.target.value) || 0,
                })
              }
              className="h-8 w-16 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Replace Image Button - Bottom Right */}
      <div className="absolute bottom-2 right-2 pointer-events-none">
        <Button
          variant="secondary"
          size="sm"
          className="h-8 px-2 pointer-events-auto shadow-lg"
          onClick={handleReplaceImage}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-1" />
          {isUploading ? "Uploading..." : "Replace"}
        </Button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Delete Button - Top Right */}
      <div className="absolute -bottom-12 right-2 pointer-events-none">
        <Button
          variant="destructive"
          size="sm"
          className="h-8 w-8 p-0 pointer-events-auto shadow-lg"
          onClick={() => actions.deleteWidget()}
          title="Delete widget"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
