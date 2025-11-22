import { z } from "zod";
import { SuccessResponse } from "../../api/schemas/api";
import {
  PaginationRequest,
  PaginationResponse,
} from "../../common/schemas/pagination-request";
import { SortOrderRequest } from "../../common/schemas/sort-order-request";
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

export const PersonUpdateRequest = z
  .object({
    personName: z
      .string()
      .min(1, "person name is required")
      .max(100, "person name is too long")
      .optional(),
    phone: z
      .object({
        phoneId: z.int().optional(),
        phoneNumber: z
          .string()
          .min(1, "phone number is too short")
          .max(20, "phone number is too long"),
        preferred: z.boolean(),
      })
      .optional(),
    address: z
      .object({
        addressId: z.int().optional(),
        address: z
          .string()
          .min(1, "address is too short")
          .max(500, "address is too long"),
        preferred: z.boolean(),
      })
      .optional(),
  })
  .meta({ id: "PersonUpdateRequest" });
export type PersonUpdateRequest = z.infer<typeof PersonUpdateRequest>;

export const PersonUpdateResponse = SuccessResponse(Person);
export type PersonUpdateResponse = z.infer<typeof PersonUpdateResponse>;

export const PersonSortFieldRequest = z
  .object({
    sortField: z.enum(["personName"]).default("personName"),
  })
  .meta({ id: "PersonSortFieldRequest" });

export const PersonFilter = z
  .object({
    personName: z.string().max(100, "person name is too long").optional(),
  })
  .extend(SortOrderRequest.shape)
  .extend(PersonSortFieldRequest.shape)
  .extend(PaginationRequest.shape)
  .meta({ id: "PersonFilter" });
export type PersonFilter = z.infer<typeof PersonFilter>;

export const PersonGetResponse = SuccessResponse(Person);
export type PersonGetResponse = z.infer<typeof PersonGetResponse>;

export const PersonListResponse = SuccessResponse(
  z.array(Person),
  PaginationResponse,
);
export type PersonListResponse = z.infer<typeof PersonListResponse>;
