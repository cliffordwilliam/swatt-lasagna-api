import { z } from "zod";
import { SuccessResponse } from "../../api/schemas/api";
import {
  PaginationRequest,
  PaginationResponse,
} from "../../common/schemas/pagination-request";
import { SortOrderRequest } from "../../common/schemas/sort-order-request";

export const PersonAddress = z
  .object({
    addressId: z.int(),
    personId: z.int(),
    address: z.string(),
    preferred: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .meta({ id: "PersonAddress" });

export type PersonAddress = z.infer<typeof PersonAddress>;

export const PersonAddressSortFieldRequest = z
  .object({
    sortField: z.enum(["address", "preferred"]).default("address"),
  })
  .meta({ id: "PersonAddressSortFieldRequest" });

export const PersonAddressCreateRequest = z
  .object({
    personId: z.coerce
      .number()
      .int()
      .positive("person ID is required and must be positive"),
    address: z
      .string()
      .min(1, "address is too short")
      .max(500, "address is too long"),
    preferred: z.boolean(),
  })
  .meta({ id: "PersonAddressCreateRequest" });
export type PersonAddressCreateRequest = z.infer<
  typeof PersonAddressCreateRequest
>;

export const PersonAddressUpdateRequest = z
  .object({
    address: z
      .string()
      .min(1, "address is too short")
      .max(500, "address is too long"),
    preferred: z.boolean(),
  })
  .meta({ id: "PersonAddressUpdateRequest" });
export type PersonAddressUpdateRequest = z.infer<
  typeof PersonAddressUpdateRequest
>;

export const PersonAddressFilter = z
  .object({
    personId: z.coerce.number().int().positive().optional(),
    address: z.string().max(500, "address is too long").optional(),
    preferred: z.coerce.boolean().optional(),
  })
  .extend(SortOrderRequest.shape)
  .extend(PersonAddressSortFieldRequest.shape)
  .extend(PaginationRequest.shape)
  .meta({ id: "PersonAddressFilter" });
export type PersonAddressFilter = z.infer<typeof PersonAddressFilter>;

export const PersonAddressCreateResponse = SuccessResponse(PersonAddress);
export type PersonAddressCreateResponse = z.infer<
  typeof PersonAddressCreateResponse
>;

export const PersonAddressUpdateResponse = SuccessResponse(PersonAddress);
export type PersonAddressUpdateResponse = z.infer<
  typeof PersonAddressUpdateResponse
>;

export const PersonAddressGetResponse = SuccessResponse(PersonAddress);
export type PersonAddressGetResponse = z.infer<typeof PersonAddressGetResponse>;

export const PersonAddressListResponse = SuccessResponse(
  z.array(PersonAddress),
  PaginationResponse,
);
export type PersonAddressListResponse = z.infer<
  typeof PersonAddressListResponse
>;
