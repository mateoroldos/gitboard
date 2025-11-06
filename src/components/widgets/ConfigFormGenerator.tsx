import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getEnumOptions, inferFieldType } from "./zod-helpers";

interface ConfigFormGeneratorProps {
  schema: z.ZodObject<any>;
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function ConfigFormGenerator({
  schema,
  values,
  onChange,
  onValidationChange,
}: ConfigFormGeneratorProps) {
  const form = useForm({
    defaultValues: values,
    onSubmit: async ({ value }) => {
      onChange(value);
    },
    validators: {
      onChange: ({ value }: { value: Record<string, any> }) => {
        // Use Zod for validation
        const result = schema.safeParse(value);

        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            if (issue.path.length > 0) {
              errors[issue.path[0] as string] = issue.message;
            }
          });
          onValidationChange?.(false);
          onChange(value);
          return errors;
        }

        onValidationChange?.(true);
        onChange(value);
        return {};
      },
    },
  });

  const renderField = (fieldKey: string, zodType: z.ZodTypeAny) => {
    const fieldType = inferFieldType(zodType);
    const enumOptions = getEnumOptions(zodType);

    return (
      <form.Field
        key={fieldKey}
        name={fieldKey}
        validators={{
          onChange: ({ value }: { value: any }) => {
            // Individual field validation using Zod
            const fieldSchema = z.object({ [fieldKey]: zodType });
            const result = fieldSchema.safeParse({ [fieldKey]: value });

            if (!result.success) {
              const issue = result.error.issues.find(
                (issue) => issue.path[0] === fieldKey,
              );
              return issue?.message;
            }
            return undefined;
          },
        }}
      >
        {(fieldApi: any) => (
          <div className="space-y-2">
            <Label htmlFor={fieldKey}>
              {fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}
              {!(zodType instanceof z.ZodOptional) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>

            {/* Render different input types */}
            {fieldType === "string" ? (
              <Input
                id={fieldKey}
                type="text"
                value={fieldApi.state.value || ""}
                onChange={(e) => fieldApi.handleChange(e.target.value)}
                onBlur={fieldApi.handleBlur}
                placeholder={
                  fieldKey === "repository" ? "owner/repository-name" : ""
                }
                className={
                  fieldApi.state.meta.errors.length > 0 ? "border-red-500" : ""
                }
              />
            ) : fieldType === "number" ? (
              <Input
                id={fieldKey}
                type="number"
                value={fieldApi.state.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  fieldApi.handleChange(value === "" ? undefined : value);
                }}
                onBlur={fieldApi.handleBlur}
                className={
                  fieldApi.state.meta.errors.length > 0 ? "border-red-500" : ""
                }
              />
            ) : fieldType === "boolean" ? (
              <div className="flex items-center space-x-2">
                <input
                  id={fieldKey}
                  type="checkbox"
                  checked={fieldApi.state.value || false}
                  onChange={(e) => fieldApi.handleChange(e.target.checked)}
                  onBlur={fieldApi.handleBlur}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor={fieldKey} className="text-sm font-normal">
                  Enable {fieldKey}
                </Label>
              </div>
            ) : fieldType === "select" && enumOptions ? (
              <select
                id={fieldKey}
                value={fieldApi.state.value || ""}
                onChange={(e) => fieldApi.handleChange(e.target.value)}
                onBlur={fieldApi.handleBlur}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  fieldApi.state.meta.errors.length > 0 ? "border-red-500" : ""
                }`}
              >
                <option value="">Select an option...</option>
                {enumOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <p className="text-sm text-yellow-800">
                  Unsupported field type: {fieldType}
                </p>
              </div>
            )}

            {/* Error messages */}
            {fieldApi.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">
                {fieldApi.state.meta.errors[0]}
              </p>
            )}

            {/* Helper text for repository field */}
            {fieldKey === "repository" && (
              <p className="text-xs text-muted-foreground">
                Example: facebook/react, microsoft/vscode
              </p>
            )}
          </div>
        )}
      </form.Field>
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="space-y-6">
        {Object.entries(schema.shape).map(([fieldKey, zodType]) =>
          renderField(fieldKey, zodType as z.ZodTypeAny),
        )}
      </div>
    </form>
  );
}

