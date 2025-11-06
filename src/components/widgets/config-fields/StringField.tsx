import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ConfigField } from "../types";

interface StringFieldProps {
  field: ConfigField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  fieldKey: string;
}

export function StringField({
  field,
  value,
  onChange,
  error,
  fieldKey,
}: StringFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldKey}>
        {field.label}
        {field.required && <span className="ml-1">*</span>}
      </Label>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      <Input
        id={fieldKey}
        type="text"
        value={value || ""}
        onChange={handleChange}
        placeholder={field.defaultValue || ""}
        className={error ? "text-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

