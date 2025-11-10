import type { ImageData, ImageConfig } from "./types";

export function createPreviewImageData(config: ImageConfig): ImageData {
  return {
    imageKey: config.imageKey || "",
    imageUrl: config.imageKey ? `https://picsum.photos/400/300?random=${config.imageKey}` : null,
    title: config.title || "",
    altText: config.altText || "",
    fit: config.fit || "cover",
    borderRadius: config.borderRadius || 0,
  };
}

export function getImageFitClass(fit: string): string {
  switch (fit) {
    case "cover":
      return "object-cover";
    case "contain":
      return "object-contain";
    case "fill":
      return "object-fill";
    default:
      return "object-cover";
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function isValidImageFile(file: File): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  return validTypes.includes(file.type);
}