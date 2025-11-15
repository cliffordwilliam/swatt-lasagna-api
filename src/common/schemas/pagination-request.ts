import { z } from "zod";

export const PaginationRequest = z
  .object({
    mode: z
      .string()
      .transform((val) => val.toLowerCase())
      .pipe(z.enum(["and", "or"]))
      .default("and"),
    page: z.coerce
      .number()
      .min(1, "Page must be at least one")
      .max(100, "Page cannot exceed 100")
      .default(1),
    pageSize: z.coerce
      .number()
      .min(1, "Page size must be at least one")
      .max(100, "Page size cannot exceed 100")
      .default(10),
  })
  .meta({ id: "PaginationRequest" });

export const PaginationResponse = z
  .object({
    page: z.int(),
    pageSize: z.int(),
    totalCount: z.int(),
    totalPages: z.int(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
  })
  .meta({ id: "PaginationResponse" });
