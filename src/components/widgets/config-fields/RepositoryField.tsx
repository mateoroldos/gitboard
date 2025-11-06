import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ConfigField } from "../types";

interface RepositoryFieldProps {
  field: ConfigField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  fieldKey: string;
}

export function RepositoryField({ field, value, onChange, error, fieldKey }: RepositoryFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Basic validation for repository format (owner/name)
  const validateRepository = (repo: string): string | undefined => {
    if (!repo && field.required) {
      return "Repository is required";
    }
    if (repo && !/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(repo)) {
      return "Repository must be in format: owner/name";
    }
    return undefined;
  };

  const validationError = validateRepository(value);
  const displayError = error || validationError;

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
        type="text"
        value={value || ""}
        onChange={handleChange}
        placeholder="owner/repository-name"
        className={displayError ? "border-red-500" : ""}
      />
      {displayError && <p className="text-sm text-red-500">{displayError}</p>}
      <p className="text-xs text-muted-foreground">
        Example: facebook/react, microsoft/vscode
      </p>
    </div>
  );
}