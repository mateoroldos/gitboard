export type ImageFit = "cover" | "contain" | "fill";

export interface ImageData {
  imageKey: string;
  imageUrl: string | null;
  title: string;
  altText: string;
  fit: ImageFit;
  borderRadius: number;
}

export interface ImageConfig {
  imageKey: string;
  title: string;
  altText: string;
  fit: ImageFit;
  borderRadius: number;
}