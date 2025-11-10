import { ImageRoot } from "./image-root";
import { ImageDisplay } from "./image-display";
import { ImageEmptyState } from "./image-empty-state";
import { useImage } from "./image-context";

function ImageContent() {
  const { imageData } = useImage();

  if (!imageData || !imageData.imageKey || !imageData.imageUrl) {
    return <ImageEmptyState />;
  }

  return <ImageDisplay />;
}

export function ImageWidget() {
  return (
    <ImageRoot>
      <ImageContent />
    </ImageRoot>
  );
}