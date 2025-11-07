import { z } from "zod";

export const ErrorResponse = z.object({
  success: z.boolean(),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.unknown().optional(),
  }),
});
export type ErrorResponse = z.infer<typeof ErrorResponse>;

export const SuccessResponse = <T extends z.ZodType, M extends z.ZodType>(
  data: T,
  meta?: M,
) =>
  z.object({
    success: z.boolean(),
    data,
    ...(meta ? { meta } : {}),
  });
export type SuccessResponse = z.infer<typeof SuccessResponse>;
