import { z } from "zod";
import { SuccessResponse } from "../../api/schemas/api";
import {
  PaginationRequest,
  PaginationResponse,
} from "../../common/schemas/pagination-request";
import { SortOrderRequest } from "../../common/schemas/sort-order-request";

export const Item = z
  .object({
    itemId: z.int(),
    itemName: z.string(),
    price: z.int(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .meta({ id: "Item" });

export const ItemSortFieldRequest = z
  .object({
    sortField: z.enum(["itemName", "price"]).default("itemName"),
  })
  .meta({ id: "ItemSortFieldRequest" });

export const ItemCreateRequest = z
  .object({
    itemName: z
      .string()
      .min(1, "item name is required")
      .max(100, "item name is too long"),

    price: z.coerce
      .number()
      .int()
      .min(1, "price is required")
      .max(50_000_000, "price is too big"),
  })
  .meta({ id: "ItemCreateRequest" });
export type ItemCreateRequest = z.infer<typeof ItemCreateRequest>;

export const ItemUpdateRequest = z
  .object({
    itemName: z
      .string()
      .min(1, "item name is required")
      .max(100, "item name is too long")
      .optional(),

    price: z.coerce
      .number()
      .int()
      .min(1, "price is required")
      .max(50_000_000, "price is too big")
      .optional(),
  })
  .meta({ id: "ItemUpdateRequest" });
export type ItemUpdateRequest = z.infer<typeof ItemUpdateRequest>;

export const ItemFilter = z
  .object({
    itemName: z.string().max(100, "item name is too long").optional(),
    price: z.coerce
      .number()
      .int()
      .max(50_000_000, "price is too big")
      .optional(),
  })
  .extend(SortOrderRequest.shape)
  .extend(ItemSortFieldRequest.shape)
  .extend(PaginationRequest.shape)
  .meta({ id: "ItemFilter" });
export type ItemFilter = z.infer<typeof ItemFilter>;

export const ItemCreateResponse = SuccessResponse(Item);
export type ItemCreateResponse = z.infer<typeof ItemCreateResponse>;

export const ItemUpdateResponse = SuccessResponse(Item);
export type ItemUpdateResponse = z.infer<typeof ItemUpdateResponse>;

export const ItemGetResponse = SuccessResponse(Item);
export type ItemGetResponse = z.infer<typeof ItemGetResponse>;

export const ItemListResponse = SuccessResponse(
  z.array(Item),
  PaginationResponse,
);
export type ItemListResponse = z.infer<typeof ItemListResponse>;
