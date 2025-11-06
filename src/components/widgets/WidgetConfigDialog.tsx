import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfigFormGenerator } from "./ConfigFormGenerator";
import { WidgetRenderer } from "./WidgetRenderer";
import type { WidgetDefinition } from "./types";

interface WidgetConfigDialogProps {
  widget: {
    _id: string;
    widgetType: string;
    config: Record<string, any>;
    title?: string;
  };
  widgetDefinition: WidgetDefinition;
  repository: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: Record<string, any>) => void;
}

export function WidgetConfigDialog({
  widget,
  widgetDefinition,
  repository,
  open,
  onOpenChange,
  onSave,
}: WidgetConfigDialogProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>(widget.config);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens or widget changes
  useEffect(() => {
    if (open) {
      setFormValues(widget.config);
      setErrors({});
    }
  }, [open, widget.config]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.entries(widgetDefinition.configSchema).forEach(([key, field]) => {
      const value = formValues[key];

      // Required field validation
      if (field.required && (!value || value === "")) {
        newErrors[key] = `${field.label} is required`;
      }

      // Number validation
      if (field.type === "number" && value !== undefined && value !== "") {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          newErrors[key] = `${field.label} must be a number`;
        } else {
          if (field.validation?.min !== undefined && numValue < field.validation.min) {
            newErrors[key] = `${field.label} must be at least ${field.validation.min}`;
          }
          if (field.validation?.max !== undefined && numValue > field.validation.max) {
            newErrors[key] = `${field.label} must be at most ${field.validation.max}`;
          }
        }
      }

      // Repository validation
      if (field.type === "repository" && value) {
        if (!/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(value)) {
          newErrors[key] = "Repository must be in format: owner/name";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formValues);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save widget config:", error);
      // Could add error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormValues(widgetDefinition.defaultConfig);
    setErrors({});
  };

  const handleCancel = () => {
    setFormValues(widget.config);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Configure {widgetDefinition.name}</DialogTitle>
          <DialogDescription>
            Customize the settings for your {widgetDefinition.name.toLowerCase()} widget.
            Changes will be reflected in the preview on the right.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 overflow-hidden">
          {/* Configuration Form */}
          <div className="flex-1 overflow-y-auto max-h-[500px] pr-2">
            <ConfigFormGenerator
              schema={widgetDefinition.configSchema}
              values={formValues}
              onChange={setFormValues}
              errors={errors}
            />
          </div>

          {/* Live Preview */}
          <div className="flex-1 border-l pl-6">
            <h3 className="font-medium text-sm mb-3">Preview</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <WidgetRenderer
                widgetType={widget.widgetType}
                config={formValues}
                instanceId={widget._id}
                repository={repository}
                isEditing={true}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}