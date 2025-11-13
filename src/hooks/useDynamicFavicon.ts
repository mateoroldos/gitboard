import { useEffect } from "react";
import { type Theme } from "@/lib/theme";

export function useDynamicFavicon(theme: Theme) {
  useEffect(() => {
    const updateFavicon = () => {
      // Create SVG string for LayoutDashboard icon with theme-appropriate colors
      const backgroundColor = theme === "dark" ? "#0a0a0a" : "#ffffff";
      const iconColor = theme === "dark" ? "#ffffff" : "#0a0a0a";

      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" fill="${backgroundColor}" rx="6"/>
          <g transform="translate(4, 4)" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
            <rect width="7" height="9" x="3" y="3" rx="0.1"/>
            <rect width="7" height="5" x="14" y="3" rx="0.1"/>
            <rect width="7" height="9" x="14" y="12" rx="0.1"/>
            <rect width="7" height="5" x="3" y="16" rx="0.1"/>
          </g>
        </svg>
      `;

      // Convert SVG to data URL
      const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

      // Remove existing favicon links
      const existingLinks = document.querySelectorAll('link[rel*="icon"]');
      existingLinks.forEach((link) => link.remove());

      // Create new favicon link
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = dataUrl;

      // Add to document head
      document.head.appendChild(link);
    };

    updateFavicon();
  }, [theme]);
}

