import type {
  TextData,
  TextConfig,
  FontFamily,
  TextAlign,
  FontWeight,
} from "./types";

export function createTextDataFromConfig(config: TextConfig): TextData {
  return {
    content: config.content || "",
    fontScale: typeof config.fontScale === "number" ? config.fontScale : 1.0,
    fontFamily: isValidFontFamily(config.fontFamily)
      ? config.fontFamily
      : "sans",
    textAlign: isValidTextAlign(config.textAlign) ? config.textAlign : "left",
    fontWeight: isValidFontWeight(config.fontWeight)
      ? config.fontWeight
      : "normal",
    textColor: config.textColor || "#000000",
    backgroundColor: config.backgroundColor || "transparent",
    padding: typeof config.padding === "number" ? config.padding : 16,
  };
}

function isValidFontFamily(family: string): boolean {
  return ["sans", "serif", "mono"].includes(family);
}

function isValidTextAlign(align: string): boolean {
  return ["left", "center", "right", "justify"].includes(align);
}

function isValidFontWeight(weight: string): boolean {
  return ["normal", "medium", "semibold", "bold"].includes(weight);
}

export function calculateOptimalFontSize(
  text: string,
  containerWidth: number,
  containerHeight: number,
  fontScale: number,
  fontFamily: FontFamily,
  fontWeight: FontWeight,
  padding: number = 16,
): number {
  if (!text || containerWidth <= 0 || containerHeight <= 0) {
    return 16;
  }

  const availableWidth = containerWidth - padding * 2;
  const availableHeight = containerHeight - padding * 2;

  if (availableWidth <= 0 || availableHeight <= 0) {
    return 12;
  }

  // Create a temporary canvas to measure text
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 16;

  // Set font properties for measurement
  const getFontString = (size: number) => {
    const weight =
      fontWeight === "normal"
        ? "400"
        : fontWeight === "medium"
          ? "500"
          : fontWeight === "semibold"
            ? "600"
            : "700";
    const family =
      fontFamily === "serif"
        ? "serif"
        : fontFamily === "mono"
          ? "monospace"
          : "sans-serif";
    return `${weight} ${size}px ${family}`;
  };

  // Binary search for optimal font size
  let minSize = 8;
  let maxSize = Math.min(availableHeight, 200);
  let optimalSize = 16;

  // Split text into lines for multi-line handling
  const lines = text.split("\n");
  const maxIterations = 20; // Prevent infinite loops
  let iterations = 0;

  while (minSize <= maxSize && iterations < maxIterations) {
    iterations++;
    const testSize = Math.floor((minSize + maxSize) / 2);
    ctx.font = getFontString(testSize);

    let fits = true;
    let totalHeight = 0;
    const lineHeight = testSize * 1.2; // Standard line height

    for (const line of lines) {
      const metrics = ctx.measureText(line);
      const lineWidth = metrics.width;

      // Check if line fits horizontally
      if (lineWidth > availableWidth) {
        // For long lines, estimate how many wrapped lines we'd need
        const estimatedLines = Math.ceil(lineWidth / availableWidth);
        totalHeight += lineHeight * estimatedLines;
      } else {
        totalHeight += lineHeight;
      }
    }

    // Check if total height fits
    if (totalHeight > availableHeight) {
      fits = false;
    }

    // Also check the longest single line
    const longestLine = lines.reduce(
      (longest, line) => (line.length > longest.length ? line : longest),
      "",
    );
    const longestLineWidth = ctx.measureText(longestLine).width;

    if (longestLineWidth > availableWidth) {
      // If even the longest line doesn't fit, we might need word wrapping
      // For now, consider it as not fitting if it's significantly over
      if (longestLineWidth > availableWidth * 1.5) {
        fits = false;
      }
    }

    if (fits) {
      optimalSize = testSize;
      minSize = testSize + 1;
    } else {
      maxSize = testSize - 1;
    }
  }

  // Apply user scale factor
  const scaledSize = optimalSize * fontScale;

  // Ensure reasonable bounds
  return Math.max(8, Math.min(scaledSize, 200));
}

export function getLineHeight(fontSize: number): number {
  return fontSize * 1.2; // Standard 1.2 line height
}

export function estimateTextDimensions(
  text: string,
  fontSize: number,
  fontFamily: FontFamily,
  fontWeight: FontWeight,
): { width: number; height: number } {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return { width: 0, height: 0 };
  }

  const weight =
    fontWeight === "normal"
      ? "400"
      : fontWeight === "medium"
        ? "500"
        : fontWeight === "semibold"
          ? "600"
          : "700";
  const family =
    fontFamily === "serif"
      ? "serif"
      : fontFamily === "mono"
        ? "monospace"
        : "sans-serif";

  ctx.font = `${weight} ${fontSize}px ${family}`;

  const lines = text.split("\n");
  const lineHeight = getLineHeight(fontSize);

  let maxWidth = 0;
  for (const line of lines) {
    const metrics = ctx.measureText(line);
    maxWidth = Math.max(maxWidth, metrics.width);
  }

  const totalHeight = lines.length * lineHeight;

  return { width: maxWidth, height: totalHeight };
}

export function getFontFamilyClass(family: FontFamily): string {
  switch (family) {
    case "sans":
      return "font-sans";
    case "serif":
      return "font-serif";
    case "mono":
      return "font-mono";
    default:
      return "font-sans";
  }
}

export function getTextAlignClass(align: TextAlign): string {
  switch (align) {
    case "left":
      return "text-left";
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    case "justify":
      return "text-justify";
    default:
      return "text-left";
  }
}

export function getFontWeightClass(weight: FontWeight): string {
  switch (weight) {
    case "normal":
      return "font-normal";
    case "medium":
      return "font-medium";
    case "semibold":
      return "font-semibold";
    case "bold":
      return "font-bold";
    default:
      return "font-normal";
  }
}

