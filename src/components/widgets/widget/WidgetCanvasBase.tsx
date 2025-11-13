import React, { useCallback, useEffect } from "react";
import { useWidgetCanvasContext } from "./WidgetCanvasContext";

interface WidgetCanvasBaseProps {
  children: React.ReactNode;
}

export function WidgetCanvasBase({ children }: WidgetCanvasBaseProps) {
  const { setIsSelected } = useWidgetCanvasContext();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsSelected(true);
    },
    [setIsSelected],
  );

  const handleClickOutside = useCallback(() => {
    setIsSelected(false);
  }, [setIsSelected]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
}