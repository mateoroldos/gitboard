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
      <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
        <h3 className="font-medium text-destructive mb-2">Unknown Widget</h3>
        <p className="text-sm text-destructive/80">
          Widget type "{widgetType}" not found in registry.
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

