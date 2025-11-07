import { z } from "zod";

export const PageSchema = z.coerce
  .number()
  .min(1, "Page size must be at least one")
  .max(100, "Page size cannot exceed 100")
  .default(10);

export const PageSizeSchema = z.coerce
  .number()
  .min(1, "Page size must be at least one")
  .max(100, "Page size cannot exceed 100")
  .default(10);

export const PaginationResponse = z.object({
  page: z.int(),
  page_size: z.int(),
  total_count: z.int(),
  total_pages: z.int(),
  has_next: z.boolean(),
  has_previous: z.boolean(),
});
