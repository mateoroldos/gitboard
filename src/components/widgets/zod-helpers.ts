import { z } from "zod";

type SupportedZodField =
  | z.ZodString
  | z.ZodNumber
  | z.ZodBoolean
  | z.ZodEnum<any>
  | z.ZodOptional<z.ZodString | z.ZodNumber | z.ZodBoolean | z.ZodEnum<any>>
  | z.ZodDefault<z.ZodString | z.ZodNumber | z.ZodBoolean | z.ZodEnum<any>>;

type ValidatedZodSchema<T extends z.ZodRawShape> = {
  [K in keyof T]: T[K] extends SupportedZodField ? T[K] : never;
};

export function createWidgetSchema<T extends z.ZodRawShape>(
  shape: ValidatedZodSchema<T>,
): z.ZodObject<T> {
  return z.object(shape);
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
