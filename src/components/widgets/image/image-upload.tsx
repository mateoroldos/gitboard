import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadFile } from "@convex-dev/r2/react";
import { api } from "convex/_generated/api";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { isValidImageFile } from "./utils";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete: (imageKey: string) => void;
  onUploadError: (error: string) => void;
}

export function ImageUpload({
  onUploadComplete,
  onUploadError,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadFile = useUploadFile(api.image);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!isValidImageFile(file)) {
        onUploadError(
          "Please select a valid image file (JPEG, PNG, GIF, SVG, or WebP)",
        );
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        onUploadError("File size must be less than 10MB");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        const imageKey = await uploadFile(file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        setTimeout(() => {
          onUploadComplete(imageKey);
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      } catch (error) {
        setIsUploading(false);
        setUploadProgress(0);
        onUploadError(error instanceof Error ? error.message : "Upload failed");
      }
    },
    [uploadFile, onUploadComplete, onUploadError],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
    },
    multiple: false,
    disabled: isUploading,
    noClick: true, // Prevent click from opening file dialog
  });

  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-6 space-y-4">
        <div className="text-sm text-muted-foreground">Uploading image...</div>
        <Progress value={uploadProgress} className="w-full max-w-xs" />
        <div className="text-xs text-muted-foreground">{uploadProgress}%</div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden w-full h-full flex">
      <CardContent className="flex flex-1 items-center justify-center">
        <div {...getRootProps()}>
          <input {...getInputProps()} />

          <div className="text-center space-y-4 flex flex-col items-center">
            <Image />
            {isDragActive ? (
              <div className="text-primary">
                <div className="font-medium">Drop your image here</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-medium text-foreground">
                  Drag & drop an image here
                </div>
                <div className="text-sm text-muted-foreground">
                  or click to select a file
                </div>
                <Button size="sm" className="mt-2" onClick={open}>
                  Choose Image
                </Button>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Supports JPEG, PNG, GIF, SVG, WebP (max 10MB)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
