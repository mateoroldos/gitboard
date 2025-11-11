import { ReactNode } from "react";

interface TextRootProps {
  children: ReactNode;
  className?: string;
}

export function TextRoot({ children, className }: TextRootProps) {
  return (
    <div className={`overflow-hidden w-full h-full ${className}`}>
      {children}
    </div>
  );
}