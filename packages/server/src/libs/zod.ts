import z, { type ZodType } from "zod";

export const stringToNumberSchema = (def: number) =>
  z.string().default(`${def}`).transform(Number);

export const stringToDateSchema = (def: Date) =>
  z
    .string()
    .default(`${def}`)
    .transform((val) => new Date(val))
    .refine((val) => !Number.isNaN(val.getTime()), {
      message: "String is not a valid Date",
    });

export const unsafePreprocessor =
  <O, Z extends ZodType<O>>(preprocessorSchema: Z) =>
  (val: unknown): O | null =>
    preprocessorSchema.parse(val);
