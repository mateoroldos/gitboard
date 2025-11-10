import { ImageRoot } from "./image-root";
import { ImageDisplay } from "./image-display";
import { useImage } from "./image-context";

function ImagePreviewContent() {
  const { imageData } = useImage();

  if (!imageData || !imageData.imageKey) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center">
          <div className="text-4xl mb-2">📷</div>
          <div className="text-sm">Image Preview</div>
          <div className="text-xs mt-1">Upload an image to see preview</div>
        </div>
      </div>
    );
  }

  return <ImageDisplay />;
}

export function ImagePreview() {
  return (
    <ImageRoot>
      <ImagePreviewContent />
    </ImageRoot>
  );
}

