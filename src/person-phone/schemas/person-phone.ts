import { z } from "zod";
import { SuccessResponse } from "../../api/schemas/api";
import {
  PaginationRequest,
  PaginationResponse,
} from "../../common/schemas/pagination-request";
import { SortOrderRequest } from "../../common/schemas/sort-order-request";

export const PersonPhone = z
  .object({
    phoneId: z.int(),
    personId: z.int(),
    phoneNumber: z.string(),
    preferred: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .meta({ id: "PersonPhone" });

export type PersonPhone = z.infer<typeof PersonPhone>;

export const PersonPhoneSortFieldRequest = z
  .object({
    sortField: z.enum(["phoneNumber", "preferred"]).default("phoneNumber"),
  })
  .meta({ id: "PersonPhoneSortFieldRequest" });

export const PersonPhoneCreateRequest = z
  .object({
    personId: z.coerce
      .number()
      .int()
      .positive("person ID is required and must be positive"),
    phoneNumber: z
      .string()
      .min(1, "phone number is too short")
      .max(20, "phone number is too long"),
    preferred: z.boolean(),
  })
  .meta({ id: "PersonPhoneCreateRequest" });
export type PersonPhoneCreateRequest = z.infer<typeof PersonPhoneCreateRequest>;

export const PersonPhoneUpdateRequest = z
  .object({
    phoneNumber: z
      .string()
      .min(1, "phone number is too short")
      .max(20, "phone number is too long"),
    preferred: z.boolean(),
  })
  .meta({ id: "PersonPhoneUpdateRequest" });
export type PersonPhoneUpdateRequest = z.infer<typeof PersonPhoneUpdateRequest>;

export const PersonPhoneFilter = z
  .object({
    personId: z.coerce.number().int().positive().optional(),
    phoneNumber: z.string().max(20, "phone number is too long").optional(),
    preferred: z.coerce.boolean().optional(),
  })
  .extend(SortOrderRequest.shape)
  .extend(PersonPhoneSortFieldRequest.shape)
  .extend(PaginationRequest.shape)
  .meta({ id: "PersonPhoneFilter" });
export type PersonPhoneFilter = z.infer<typeof PersonPhoneFilter>;

export const PersonPhoneCreateResponse = SuccessResponse(PersonPhone);
export type PersonPhoneCreateResponse = z.infer<
  typeof PersonPhoneCreateResponse
>;

export const PersonPhoneUpdateResponse = SuccessResponse(PersonPhone);
export type PersonPhoneUpdateResponse = z.infer<
  typeof PersonPhoneUpdateResponse
>;

export const PersonPhoneGetResponse = SuccessResponse(PersonPhone);
export type PersonPhoneGetResponse = z.infer<typeof PersonPhoneGetResponse>;

export const PersonPhoneListResponse = SuccessResponse(
  z.array(PersonPhone),
  PaginationResponse,
);
export type PersonPhoneListResponse = z.infer<typeof PersonPhoneListResponse>;
