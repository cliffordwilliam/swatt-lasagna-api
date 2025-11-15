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

export const CreateItemResponse = SuccessResponse(Item);
export type CreateItemResponse = z.infer<typeof CreateItemResponse>;

export const UpdateItemResponse = SuccessResponse(Item);
export type UpdateItemResponse = z.infer<typeof UpdateItemResponse>;

export const GetItemResponse = SuccessResponse(Item);
export type GetItemResponse = z.infer<typeof GetItemResponse>;

export const ListItemResponse = SuccessResponse(
  z.array(Item),
  PaginationResponse,
);
export type ListItemResponse = z.infer<typeof ListItemResponse>;
