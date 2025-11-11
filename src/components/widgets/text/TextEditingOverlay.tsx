import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWidget } from "../WidgetProvider";

export function TextEditingOverlay() {
  const { widget, actions } = useWidget();
  const config = widget.config;

  const updateConfig = (updates: Partial<typeof config>) => {
    actions.updateConfigOptimistic({ ...config, ...updates });
  };

  const updateConfigDebounced = (updates: Partial<typeof config>) => {
    actions.updateConfigOptimisticDebounced({ ...config, ...updates });
  };

  const fontFamilyOptions = [
    { value: "sans", label: "Sans", icon: "Aa" },
    { value: "serif", label: "Serif", icon: "Aa" },
    { value: "mono", label: "Mono", icon: "Aa" },
  ];

  const fontWeightOptions = [
    { value: "normal", label: "Normal" },
    { value: "medium", label: "Medium" },
    { value: "semibold", label: "Semibold" },
    { value: "bold", label: "Bold" },
  ];

  const alignmentOptions = [
    { value: "left", icon: AlignLeft },
    { value: "center", icon: AlignCenter },
    { value: "right", icon: AlignRight },
    { value: "justify", icon: AlignJustify },
  ];

  return (
    <div className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-1 pointer-events-auto">
        {/* Font Family */}
        <div className="flex border-r border-gray-200 pr-2 mr-2">
          {fontFamilyOptions.map((option) => (
            <Button
              key={option.value}
              variant={config.fontFamily === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => updateConfig({ fontFamily: option.value as any })}
              className="h-8 px-2"
            >
              <span
                className={`text-xs font-${option.value === "mono" ? "mono" : option.value === "serif" ? "serif" : "sans"}`}
              >
                {option.label}
              </span>
            </Button>
          ))}
        </div>

        {/* Font Weight */}
        <div className="flex border-r border-gray-200 pr-2 mr-2">
          {fontWeightOptions.map((option) => (
            <Button
              key={option.value}
              variant={config.fontWeight === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => updateConfig({ fontWeight: option.value as any })}
              className="h-8 px-2"
            >
              <span className={`text-xs font-${option.value}`}>
                {option.label}
              </span>
            </Button>
          ))}
        </div>

        {/* Text Alignment */}
        <div className="flex border-r border-gray-200 pr-2 mr-2">
          {alignmentOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Button
                key={option.value}
                variant={
                  config.textAlign === option.value ? "default" : "ghost"
                }
                size="sm"
                onClick={() => updateConfig({ textAlign: option.value as any })}
                className="h-8 w-8 p-0"
              >
                <IconComponent className="h-4 w-4" />
              </Button>
            );
          })}
        </div>

        {/* Font Scale */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              updateConfigDebounced({
                fontScale: Math.max(0.5, (config.fontScale || 1) - 0.1),
              })
            }
            className="h-8 w-8 p-0"
          >
            <Type className="h-3 w-3" />
          </Button>
          <span className="text-xs text-gray-600 min-w-[2rem] text-center">
            {Math.round((config.fontScale || 1) * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              updateConfigDebounced({
                fontScale: Math.min(3, (config.fontScale || 1) + 0.1),
              })
            }
            className="h-8 w-8 p-0"
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete Button - Top Right */}
      <div className="absolute -top-12 right-2 pointer-events-none">
        <Button
          variant="destructive"
          size="sm"
          className="h-8 w-8 p-0 pointer-events-auto shadow-lg"
          onClick={() => actions.deleteWidget()}
          title="Delete widget"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

