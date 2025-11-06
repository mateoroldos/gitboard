import { useState, useEffect } from "react";
import type { ConfigSchema } from "./types";
import { StringField } from "./config-fields/StringField";
import { NumberField } from "./config-fields/NumberField";
import { BooleanField } from "./config-fields/BooleanField";
import { SelectField } from "./config-fields/SelectField";
import { RepositoryField } from "./config-fields/RepositoryField";

interface ConfigFormGeneratorProps {
  schema: ConfigSchema;
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  errors?: Record<string, string>;
}

export function ConfigFormGenerator({ 
  schema, 
  values, 
  onChange, 
  errors = {} 
}: ConfigFormGeneratorProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>(values);

  // Update form values when props change
  useEffect(() => {
    setFormValues(values);
  }, [values]);

  const handleFieldChange = (fieldKey: string, value: any) => {
    const newValues = { ...formValues, [fieldKey]: value };
    setFormValues(newValues);
    onChange(newValues);
  };

  const renderField = (fieldKey: string, field: any) => {
    const commonProps = {
      field,
      value: formValues[fieldKey],
      onChange: (value: any) => handleFieldChange(fieldKey, value),
      error: errors[fieldKey],
      fieldKey,
    };

    switch (field.type) {
      case 'string':
        return <StringField key={fieldKey} {...commonProps} />;
      
      case 'number':
        return <NumberField key={fieldKey} {...commonProps} />;
      
      case 'boolean':
        return <BooleanField key={fieldKey} {...commonProps} />;
      
      case 'select':
        return <SelectField key={fieldKey} {...commonProps} />;
      
      case 'repository':
        return <RepositoryField key={fieldKey} {...commonProps} />;
      
      case 'color':
        // For now, treat color as string - can be enhanced later
        return <StringField key={fieldKey} {...commonProps} />;
      
      default:
        return (
          <div key={fieldKey} className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <p className="text-sm text-yellow-800">
              Unsupported field type: {field.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(schema).map(([fieldKey, field]) => (
        <div key={fieldKey}>
          {renderField(fieldKey, field)}
        </div>
      ))}
    </div>
  );
}