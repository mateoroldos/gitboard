import { z } from "zod";

export interface FieldMetadata {
  label?: string;
  placeholder?: string;
  description?: string;
  inputType?: 'input' | 'textarea' | 'select' | 'checkbox' | 'number';
  rows?: number; // for textarea
  validation?: {
    errorMessage?: string;
  };
}

type ZodWithMetadata = z.ZodTypeAny & { _fieldMeta?: FieldMetadata };

type SupportedZodField =
  | z.ZodString
  | z.ZodNumber
  | z.ZodBoolean
  | z.ZodEnum<any>
  | z.ZodOptional<z.ZodString | z.ZodNumber | z.ZodBoolean | z.ZodEnum<any>>
  | z.ZodDefault<z.ZodString | z.ZodNumber | z.ZodBoolean | z.ZodEnum<any>>
  | ZodWithMetadata;

type ValidatedZodSchema<T extends z.ZodRawShape> = {
  [K in keyof T]: T[K] extends SupportedZodField ? T[K] : never;
};

export function createWidgetSchema<T extends z.ZodRawShape>(
  shape: ValidatedZodSchema<T>,
): z.ZodObject<T> {
  return z.object(shape);
}

// Field helper functions
export function stringField(metadata?: FieldMetadata) {
  const schema = z.string();
  return Object.assign(schema, { _fieldMeta: { ...metadata, inputType: 'input' as const } });
}

export function textareaField(metadata?: FieldMetadata) {
  const schema = z.string();
  return Object.assign(schema, { 
    _fieldMeta: { ...metadata, inputType: 'textarea' as const }
  });
}

export function numberField(metadata?: FieldMetadata) {
  const schema = z.number();
  return Object.assign(schema, { _fieldMeta: { ...metadata, inputType: 'number' as const } });
}

export function booleanField(metadata?: FieldMetadata) {
  const schema = z.boolean();
  return Object.assign(schema, { _fieldMeta: { ...metadata, inputType: 'checkbox' as const } });
}

export function enumField<T extends readonly [string, ...string[]]>(
  values: T,
  metadata?: FieldMetadata
) {
  const schema = z.enum(values);
  return Object.assign(schema, { _fieldMeta: { ...metadata, inputType: 'select' as const } });
}

// Enhanced helper functions
export function getFieldMetadata(zodType: z.ZodTypeAny): FieldMetadata | undefined {
  const withMeta = zodType as ZodWithMetadata;
  return withMeta._fieldMeta;
}

export function inferFieldType(zodType: z.ZodTypeAny): string {
  if (zodType instanceof z.ZodString) return "string";
  if (zodType instanceof z.ZodNumber) return "number";
  if (zodType instanceof z.ZodBoolean) return "boolean";
  if (zodType instanceof z.ZodEnum) return "select";
  if (zodType instanceof z.ZodOptional) {
    return inferFieldType(zodType.unwrap() as z.ZodTypeAny);
  }
  if (zodType instanceof z.ZodDefault) {
    return inferFieldType(zodType.unwrap() as z.ZodTypeAny);
  }
  return "string";
}

export function getEnumOptions(
  zodType: z.ZodTypeAny,
): Array<{ label: string; value: string }> | undefined {
  if (zodType instanceof z.ZodEnum) {
    return zodType.options.map((value: string | number) => ({
      label: String(value),
      value: String(value),
    }));
  }
  if (zodType instanceof z.ZodOptional) {
    const unwrapped = zodType.unwrap();
    if (unwrapped instanceof z.ZodEnum) {
      return unwrapped.options.map((value: string | number) => ({
        label: String(value),
        value: String(value),
      }));
    }
  }
  if (zodType instanceof z.ZodDefault) {
    const unwrapped = zodType.unwrap();
    if (unwrapped instanceof z.ZodEnum) {
      return unwrapped.options.map((value: string | number) => ({
        label: String(value),
        value: String(value),
      }));
    }
  }
  return undefined;
}
