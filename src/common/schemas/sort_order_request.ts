import z from "zod";

export const SortOrderRequest = z.object({
  sort_order: z
    .string()
    .transform((val) => val.toLowerCase())
    .pipe(z.enum(["asc", "desc"]))
    .default("asc"),
});
