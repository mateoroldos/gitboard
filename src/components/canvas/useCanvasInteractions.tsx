import { useEffect, useCallback, useRef } from "react";

interface UseCanvasInteractionsProps {
  containerRef: React.RefObject<HTMLElement | null>;
  panBy: (deltX: number, deltaY: number) => void;
  zoomBy: (delta: number, centerX: number, centerY: number) => void;
  setViewportSize: (width: number, height: number) => void;
  disabled?: boolean;
}

export function useCanvasInteractions({
  containerRef,
  panBy,
  zoomBy,
  setViewportSize,
  disabled = false,
}: UseCanvasInteractionsProps) {
  const isPanningRef = useRef(false);
  const lastPanPointRef = useRef({ x: 0, y: 0 });
  const isSpaceKeyDownRef = useRef(false);

  // Handle viewport resize
  useEffect(() => {
    const updateViewportSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewportSize(rect.width, rect.height);
      }
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, [containerRef, setViewportSize]);

  // Handle mouse wheel - pan by default, zoom with Ctrl
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (disabled) return;

      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Ctrl+scroll for zoom
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const centerX = e.clientX - rect.left;
        const centerY = e.clientY - rect.top;

        // Normalize wheel delta across browsers
        const delta = -e.deltaY / 1000;
        zoomBy(delta, centerX, centerY);
      } else {
        // Regular scroll for pan
        const panSpeed = 50;
        const deltaX = e.deltaX * panSpeed / 100;
        const deltaY = e.deltaY * panSpeed / 100;
        panBy(-deltaX, -deltaY);
      }
    },
    [disabled, panBy, zoomBy, containerRef],
  );

  // Handle mouse pan (only when space key is pressed)
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (disabled || e.button !== 0 || !isSpaceKeyDownRef.current) return; // Only left mouse button and space key

      // Don't pan if clicking on a widget
      const target = e.target as HTMLElement;
      if (target.closest("[data-widget]")) return;

      isPanningRef.current = true;
      lastPanPointRef.current = { x: e.clientX, y: e.clientY };

      if (containerRef.current) {
        containerRef.current.style.cursor = "grabbing";
      }
    },
    [disabled, panBy, zoomBy, containerRef],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanningRef.current || disabled) return;

      const deltaX = e.clientX - lastPanPointRef.current.x;
      const deltaY = e.clientY - lastPanPointRef.current.y;

      panBy(deltaX, deltaY);

      lastPanPointRef.current = { x: e.clientX, y: e.clientY };
    },
    [disabled, panBy],
  );

  const handleMouseUp = useCallback(() => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      if (containerRef.current) {
        containerRef.current.style.cursor = isSpaceKeyDownRef.current ? "grab" : "default";
      }
    }
  }, [containerRef]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;

      const panSpeed = 50;
      const zoomSpeed = 0.1;

      switch (e.key) {
        case " ":
          if (!isSpaceKeyDownRef.current) {
            e.preventDefault();
            isSpaceKeyDownRef.current = true;
            if (containerRef.current) {
              containerRef.current.style.cursor = "grab";
            }
          }
          break;
        case "ArrowUp":
        case "k":
          e.preventDefault();
          panBy(0, panSpeed);
          break;
        case "ArrowDown":
        case "j":
          e.preventDefault();
          panBy(0, -panSpeed);
          break;
        case "ArrowLeft":
        case "h":
          e.preventDefault();
          panBy(panSpeed, 0);
          break;
        case "ArrowRight":
        case "l":
          e.preventDefault();
          panBy(-panSpeed, 0);
          break;
        case "=":
        case "+":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
              zoomBy(zoomSpeed, rect.width / 2, rect.height / 2);
            }
          }
          break;
        case "-":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
              zoomBy(-zoomSpeed, rect.width / 2, rect.height / 2);
            }
          }
          break;
        case "0":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
              zoomBy(1 - 1, rect.width / 2, rect.height / 2); // Reset to 100%
            }
          }
          break;
      }
    },
    [disabled, panBy, zoomBy, containerRef],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;

      if (e.key === " ") {
        isSpaceKeyDownRef.current = false;
        if (containerRef.current && !isPanningRef.current) {
          containerRef.current.style.cursor = "default";
        }
      }
    },
    [disabled, containerRef],
  );

  // Touch handling for mobile
  const touchStartRef = useRef<{
    x: number;
    y: number;
    distance?: number;
  } | null>(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled) return;

      if (e.touches.length === 1) {
        // Single touch - pan
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      } else if (e.touches.length === 2) {
        // Two touches - zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2),
        );
        touchStartRef.current = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
          distance,
        };
      }
    },
    [disabled],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (disabled || !touchStartRef.current) return;

      e.preventDefault();

      if (e.touches.length === 1 && !touchStartRef.current.distance) {
        // Single touch pan
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        panBy(deltaX, deltaY);
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      } else if (e.touches.length === 2 && touchStartRef.current.distance) {
        // Two touch zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2),
        );

        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;

        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const relativeX = centerX - rect.left;
          const relativeY = centerY - rect.top;

          const zoomDelta = (distance - touchStartRef.current.distance) / 500;
          zoomBy(zoomDelta, relativeX, relativeY);
        }

        touchStartRef.current = { x: centerX, y: centerY, distance };
      }
    },
    [disabled, panBy, zoomBy, containerRef],
  );

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  // Attach event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse events
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Touch events
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    // Keyboard events
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Set initial cursor
    container.style.cursor = "default";

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);

      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    containerRef,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleKeyDown,
    handleKeyUp,
  ]);

  return {
    isPanning: isPanningRef.current,
  };
}
