import { useState } from "react";
import { useImage } from "./image-context";
import { getImageFitClass } from "./utils";
import { Skeleton } from "../../ui/skeleton";

export function ImageDisplay() {
  const { imageData } = useImage();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!imageData || !imageData.imageUrl) {
    return null;
  }

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const fitClass = getImageFitClass(imageData.fit);
  const borderRadiusStyle = imageData.borderRadius > 0 
    ? { borderRadius: `${imageData.borderRadius}px` } 
    : {};

  return (
    <div className="relative w-full h-full overflow-hidden" style={borderRadiusStyle}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {hasError ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Failed to load image</div>
          </div>
        </div>
      ) : (
        <img
          src={imageData.imageUrl}
          alt={imageData.altText || imageData.title || "Image"}
          className={`w-full h-full ${fitClass} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          style={borderRadiusStyle}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          draggable={false}
        />
      )}
      
      {imageData.title && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
          {imageData.title}
        </div>
      )}
    </div>
  );
}