import { z } from "zod";
import { SuccessResponse } from "../../api/schemas/api";
import { PersonPhone } from "../../person-phone/schemas/person-phone";
import { PersonAddress } from "../../person-address/schemas/person-address";

export const Person = z
  .object({
    personId: z.int(),
    personName: z.string(),
    phones: z.array(PersonPhone),
    addresses: z.array(PersonAddress),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .meta({ id: "Person" });

export const PersonCreateRequest = z
  .object({
    personName: z
      .string()
      .min(1, "person name is required")
      .max(100, "person name is too long"),
    phoneNumber: z
      .string()
      .min(1, "phone number is too short")
      .max(20, "phone number is too long")
      .optional(),
    address: z
      .string()
      .min(1, "address is too short")
      .max(500, "address is too long")
      .optional(),
  })
  .meta({ id: "PersonCreateRequest" });
export type PersonCreateRequest = z.infer<typeof PersonCreateRequest>;

export const PersonCreateResponse = SuccessResponse(Person);
export type PersonCreateResponse = z.infer<typeof PersonCreateResponse>;
