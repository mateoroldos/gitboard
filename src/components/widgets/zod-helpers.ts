import * as z from "zod";

export function inferFieldType(zodType: z.ZodTypeAny): string {
  if (zodType instanceof z.ZodString) return "string";
  if (zodType instanceof z.ZodNumber) return "number";
  if (zodType instanceof z.ZodBoolean) return "boolean";
  if (zodType instanceof z.ZodEnum) return "select";
  if (zodType instanceof z.ZodOptional)
    return inferFieldType(zodType._def.innerType);
  return "string"; // fallback
}

export function getEnumOptions(
  zodType: z.ZodTypeAny,
): Array<{ label: string; value: string }> | undefined {
  if (zodType instanceof z.ZodEnum) {
    return zodType.options.map((value: any) => ({
      label: String(value),
      value: String(value),
    }));
  }
  if (
    zodType instanceof z.ZodOptional &&
    zodType._def.innerType instanceof z.ZodEnum
  ) {
    return zodType._def.innerType.options.map((value: any) => ({
      label: String(value),
      value: String(value),
    }));
  }
  return undefined;
}
