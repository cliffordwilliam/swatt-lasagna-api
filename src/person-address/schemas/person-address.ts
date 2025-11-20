import { z } from "zod";

export const PersonAddress = z
  .object({
    addressId: z.int(),
    address: z.string(),
    preferred: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .meta({ id: "PersonAddress" });

export type PersonAddress = z.infer<typeof PersonAddress>;
