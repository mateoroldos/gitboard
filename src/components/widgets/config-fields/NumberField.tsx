import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ConfigField } from "../types";

interface NumberFieldProps {
  field: ConfigField;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  fieldKey: string;
}

export function NumberField({ field, value, onChange, error, fieldKey }: NumberFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value);
    onChange(isNaN(numValue) ? 0 : numValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldKey}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      <Input
        id={fieldKey}
        type="number"
        value={value || ""}
        onChange={handleChange}
        min={field.validation?.min}
        max={field.validation?.max}
        placeholder={field.defaultValue?.toString() || ""}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}