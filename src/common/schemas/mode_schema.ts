import { z } from "zod";

export const ModeSchema = z
  .string()
  .transform((val) => val.toLowerCase())
  .pipe(z.enum(["and", "or"]))
  .default("and");
