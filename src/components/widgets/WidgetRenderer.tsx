import { getWidgetDefinitionByType } from "./registry";
import { WidgetInstance } from "./types";
import { WidgetCanvasProvider } from "./widget/WidgetCanvasContext";
import { WidgetCanvasBase } from "./widget/WidgetCanvasBase";
import { WidgetCard } from "./widget/WidgetCard";
import { WidgetDraggable } from "./widget/WidgetDraggable";
import { WidgetProvider } from "./widget/WidgetProvider";
import { WidgetResizable } from "./widget/WidgetResizable";
import { WidgetContextMenu } from "./widget/WidgetContextMenu";
import { WidgetEditingOverlay } from "./widget/WidgetEditingOverlay";
import { WidgetNotFound } from "./WidgetNotFound";

interface WidgetComposition {
  useCard: boolean;
  useDraggable: boolean;
  useResizable: boolean;
  useContextMenu: boolean;
  useEditingOverlay: boolean;
}

function WidgetComposer({
  children,
  composition,
}: {
  children: React.ReactNode;
  composition: WidgetComposition;
}) {
  let content = children;

  if (composition.useCard) content = <WidgetCard>{content}</WidgetCard>;
  if (composition.useEditingOverlay)
    content = <WidgetEditingOverlay>{content}</WidgetEditingOverlay>;
  if (composition.useContextMenu)
    content = <WidgetContextMenu>{content}</WidgetContextMenu>;
  if (composition.useResizable)
    content = <WidgetResizable>{content}</WidgetResizable>;
  if (composition.useDraggable)
    content = <WidgetDraggable>{content}</WidgetDraggable>;

  return <>{content}</>;
}

interface WidgetRendererProps {
  widget: WidgetInstance;
  onConfigChange?: () => void;
  isEditing?: boolean;
}

export function WidgetRenderer({
  widget,
  onConfigChange,
  isEditing = false,
}: WidgetRendererProps) {
  const widgetDef = getWidgetDefinitionByType(widget.widgetType);

  if (!widgetDef) {
    return (
      <WidgetNotFound
        widget={widget}
        onConfigChange={onConfigChange}
        isEditing={isEditing}
      />
    );
  }

  const WidgetComponent =
    isEditing && widgetDef.previewComponent
      ? widgetDef.previewComponent
      : widgetDef.component;

  const shouldUseCard = widgetDef.renderStyle !== "raw";

  const composition: WidgetComposition = {
    useCard: shouldUseCard,
    useDraggable: true,
    useResizable: true,
    useContextMenu: true,
    useEditingOverlay: true,
  };

  if (!isEditing) {
    return (
      <WidgetProvider
        widget={widget}
        isEditing={isEditing}
        isPreview={isEditing}
        onConfigChange={onConfigChange}
      >
        <WidgetCanvasProvider>
          <WidgetCanvasBase>
            <WidgetComposer composition={composition}>
              <WidgetComponent />
            </WidgetComposer>
          </WidgetCanvasBase>
        </WidgetCanvasProvider>
      </WidgetProvider>
    );
  }

  return (
    <WidgetProvider
      widget={widget}
      isEditing={isEditing}
      isPreview={isEditing}
      onConfigChange={onConfigChange}
    >
      <WidgetComposer
        composition={{
          ...composition,
          useDraggable: false,
          useResizable: false,
          useContextMenu: false,
          useEditingOverlay: false,
        }}
      >
        <WidgetComponent />
      </WidgetComposer>
    </WidgetProvider>
  );
}
