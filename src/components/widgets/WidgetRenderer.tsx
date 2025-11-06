import { getWidgetById } from "./registry";

interface WidgetRendererProps {
  widgetType: string;
  config: Record<string, any>;
  instanceId: string;
  repository: string;
  onConfigChange?: (config: Record<string, any>) => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

export function WidgetRenderer({
  widgetType,
  config,
  instanceId,
  repository,
  onConfigChange,
  onDelete,
  isEditing,
}: WidgetRendererProps) {
  const widgetDef = getWidgetById(widgetType);

  if (!widgetDef) {
    return (
      <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5 group">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-destructive">Unknown Widget</h3>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded text-xs transition-all"
              aria-label="Delete widget"
              title="Delete widget"
            >
              🗑️
            </button>
          )}
        </div>
        <p className="text-sm text-destructive/80">
          Widget type "{widgetType}" not found in registry.
        </p>
        <p className="text-xs text-destructive/60 mt-2">
          This widget may have been removed or renamed. You can safely delete it.
        </p>
      </div>
    );
  }

  const WidgetComponent = widgetDef.component;

  return (
    <WidgetComponent
      config={config}
      instanceId={instanceId}
      repository={repository}
      onConfigChange={onConfigChange}
      onDelete={onDelete}
      isEditing={isEditing}
    />
  );
}

