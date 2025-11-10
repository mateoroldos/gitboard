import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadFile } from "@convex-dev/r2/react";
import { api } from "convex/_generated/api";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { isValidImageFile, formatFileSize } from "./utils";

interface ImageUploadProps {
  onUploadComplete: (imageKey: string) => void;
  onUploadError: (error: string) => void;
}

export function ImageUpload({ onUploadComplete, onUploadError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadFile = useUploadFile(api.image);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      onUploadError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      onUploadError("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
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
  }, [uploadFile, onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    disabled: isUploading,
  });

  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-6 space-y-4">
        <div className="text-sm text-gray-600">Uploading image...</div>
        <Progress value={uploadProgress} className="w-full max-w-xs" />
        <div className="text-xs text-gray-500">{uploadProgress}%</div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center w-full h-full p-6 
        border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className="text-center space-y-4">
        <div className="text-4xl">📷</div>
        
        {isDragActive ? (
          <div className="text-blue-600">
            <div className="font-medium">Drop your image here</div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="font-medium text-gray-700">
              Drag & drop an image here
            </div>
            <div className="text-sm text-gray-500">
              or click to select a file
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              Choose Image
            </Button>
          </div>
        )}
        
        <div className="text-xs text-gray-400">
          Supports JPEG, PNG, GIF, WebP (max 10MB)
        </div>
      </div>
    </div>
  );
}