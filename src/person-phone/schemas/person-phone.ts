import { z } from "zod";

export const PersonPhone = z
  .object({
    phoneId: z.int(),
    phoneNumber: z.string(),
    preferred: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .meta({ id: "PersonPhone" });

export type PersonPhone = z.infer<typeof PersonPhone>;
