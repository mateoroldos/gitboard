import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { useMutation } from "@tanstack/react-query";
import { useForm, useStore } from "@tanstack/react-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WidgetRenderer } from "./WidgetRenderer";
import { getWidgetDefinitionByType } from "./registry";
import {
  getEnumOptions,
  inferFieldType,
  getFieldMetadata,
} from "./zod-helpers";
import { WidgetDefinition, WidgetInstance } from "./types";
import { Id } from "convex/_generated/dataModel";
import { Loader } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useCanvasContext } from "../canvas/CanvasContext";
import { cn } from "@/lib/utils";

interface WidgetConfigDialogProps {
  widget: WidgetInstance;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WidgetConfigDialog({
  widget,
  open,
  onOpenChange,
}: WidgetConfigDialogProps) {
  const widgetDefinition = getWidgetDefinitionByType(
    widget.widgetType,
  ) as WidgetDefinition;

  const { repoString } = useCanvasContext();

  const { mutate: updateWidget, isPending } = useMutation({
    mutationFn: useAction(api.widgets.updateWidgetAction),
  });

  const form = useForm({
    defaultValues: widget.config,
    validators: {
      onSubmit: widgetDefinition.configSchema,
    },
    onSubmit: async ({ value }) => {
      updateWidget(
        {
          id: widget._id as Id<"widgets">,
          config: value,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    },
  });

  const previewValues = useStore(form.store, (state) => state.values);

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Configure {widgetDefinition.name}</DialogTitle>
          <DialogDescription>
            Customize the settings for your{" "}
            {widgetDefinition.name.toLowerCase()} widget. Changes will be
            reflected in the preview on the right.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 overflow-hidden">
          {/* Configuration Form */}
          <div className="flex-1 overflow-y-auto max-h-[500px] pr-2">
            <form
              id="widget-config-form"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                {Object.entries(widgetDefinition.configSchema.shape).map(
                  ([fieldKey, zodType]) => {
                    return (
                      <form.Field
                        key={fieldKey}
                        name={fieldKey}
                        children={(field) => {
                          const fieldMetadata = getFieldMetadata(zodType);
                          const fieldType =
                            fieldMetadata?.inputType || inferFieldType(zodType);
                          const enumOptions = getEnumOptions(zodType);

                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          const fieldLabel =
                            fieldMetadata?.label ||
                            fieldKey.charAt(0).toUpperCase() +
                              fieldKey.slice(1);

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={fieldKey}>
                                {fieldLabel}
                                {!(zodType instanceof z.ZodOptional) && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </FieldLabel>

                              {fieldType === "textarea" ? (
                                <Textarea
                                  id={fieldKey}
                                  name={field.name}
                                  value={field.state.value || ""}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  onBlur={field.handleBlur}
                                  placeholder={fieldMetadata?.placeholder}
                                  rows={fieldMetadata?.rows || 4}
                                  aria-invalid={isInvalid}
                                />
                              ) : fieldType === "input" ||
                                fieldType === "string" ? (
                                <Input
                                  id={fieldKey}
                                  name={field.name}
                                  type="text"
                                  value={field.state.value || ""}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  onBlur={field.handleBlur}
                                  aria-invalid={isInvalid}
                                  placeholder={fieldMetadata?.placeholder}
                                />
                              ) : fieldType === "number" ? (
                                <Input
                                  id={fieldKey}
                                  name={field.name}
                                  type="number"
                                  value={field.state.value || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.handleChange(
                                      value === "" ? undefined : Number(value),
                                    );
                                  }}
                                  onBlur={field.handleBlur}
                                  aria-invalid={isInvalid}
                                  placeholder={fieldMetadata?.placeholder}
                                />
                              ) : fieldType === "checkbox" ||
                                fieldType === "boolean" ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    id={fieldKey}
                                    name={field.name}
                                    type="checkbox"
                                    checked={field.state.value || false}
                                    onChange={(e) =>
                                      field.handleChange(e.target.checked)
                                    }
                                    onBlur={field.handleBlur}
                                    aria-invalid={isInvalid}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                  <FieldLabel
                                    htmlFor={fieldKey}
                                    className="text-sm font-normal"
                                  >
                                    {fieldMetadata?.label ||
                                      `Enable ${fieldKey}`}
                                  </FieldLabel>
                                </div>
                              ) : fieldType === "select" && enumOptions ? (
                                <Select
                                  value={field.state.value || ""}
                                  onValueChange={(value) =>
                                    field.handleChange(value)
                                  }
                                >
                                  <SelectTrigger
                                    id={fieldKey}
                                    aria-invalid={isInvalid}
                                  >
                                    <SelectValue placeholder="Select an option..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {enumOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : fieldType === "date" ? (
                                <DatePicker
                                  value={field.state.value}
                                  onChange={(value) =>
                                    field.handleChange(value)
                                  }
                                  placeholder={fieldMetadata?.placeholder}
                                  aria-invalid={isInvalid}
                                />
                              ) : (
                                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                                  <p className="text-sm text-yellow-800">
                                    Unsupported field type: {fieldType}
                                  </p>
                                </div>
                              )}

                              {/* Generic description from metadata */}
                              {fieldMetadata?.description && (
                                <FieldDescription>
                                  {fieldMetadata.description}
                                </FieldDescription>
                              )}

                              {/* Error messages */}
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      ></form.Field>
                    );
                  },
                )}
              </FieldGroup>
            </form>
          </div>

          {/* Live Preview */}
          <div className="flex-1 border-l pl-6">
            <h3 className="font-medium text-sm mb-3">Preview</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <WidgetRenderer
                widget={{
                  ...widget,
                  config: previewValues,
                }}
                isEditing={true}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              Object.entries(widgetDefinition.defaultConfig).forEach(
                ([key, value]) => {
                  form.setFieldValue(key, value);
                },
              );
            }}
            disabled={isPending}
          >
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="widget-config-form"
              disabled={isPending}
            >
              {isPending && <Loader className="animate-spin" />}
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
