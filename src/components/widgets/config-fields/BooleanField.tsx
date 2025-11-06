import { Label } from "@/components/ui/label";
import type { ConfigField } from "../types";

interface BooleanFieldProps {
  field: ConfigField;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  fieldKey: string;
}

export function BooleanField({ field, value, onChange, error, fieldKey }: BooleanFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          id={fieldKey}
          type="checkbox"
          checked={value || false}
          onChange={handleChange}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor={fieldKey} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}