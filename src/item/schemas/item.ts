import { z } from "zod";
import { SuccessResponse } from "../../api/schemas/api";
import {
  PaginationRequest,
  PaginationResponse,
} from "../../common/schemas/pagination-request";
import { SortOrderRequest } from "../../common/schemas/sort-order-request";

export const Item = z.object({
  itemId: z.int(),
  itemName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ItemSortFieldRequest = z.object({
  sortField: z.enum(["itemName"]).default("itemName"),
});

export const ItemCreateRequest = z.object({
  itemName: z
    .string()
    .min(1, "item name is required")
    .max(100, "item name is too long"),
});
export type ItemCreateRequest = z.infer<typeof ItemCreateRequest>;

export const ItemUpdateRequest = z.object({
  itemName: z
    .string()
    .min(1, "item name is required")
    .max(100, "item name is too long")
    .optional(),
});
export type ItemUpdateRequest = z.infer<typeof ItemUpdateRequest>;

export const ItemFilter = z
  .object({
    itemName: z.string().max(100, "item name is too long").optional(),
  })
  .extend(SortOrderRequest.shape)
  .extend(ItemSortFieldRequest.shape)
  .extend(PaginationRequest.shape);
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
