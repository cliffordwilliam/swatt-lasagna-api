import { z } from "zod";
import { SuccessResponse } from "../../api/schemas/api";
import {
  PaginationRequest,
  PaginationResponse,
} from "../../common/schemas/pagination-request";
import { WaffleEnum } from "../../common/enums/waffle-enum";
import { SortOrderRequest } from "../../common/schemas/sort-order-request";

export const Waffle = z.object({
  waffleId: z.int(),
  waffleName: z.string(),
  waffleCategory: WaffleEnum,
});

export const WaffleSortFieldRequest = z.object({
  sortField: z
    .enum(["waffleId", "waffleName", "waffleCategory"])
    .default("waffleName"),
});

export const WaffleCreateRequest = z.object({
  waffleName: z
    .string()
    .min(1, "Waffle name is required")
    .max(15, "Waffle name is too long"),
  waffleCategory: WaffleEnum,
});
export type WaffleCreateRequest = z.infer<typeof WaffleCreateRequest>;

export const WaffleUpdateRequest = z.object({
  waffleName: z
    .string()
    .min(1, "Waffle name is required")
    .max(15, "Waffle name is too long")
    .optional(),
  waffleCategory: WaffleEnum.optional(),
});
export type WaffleUpdateRequest = z.infer<typeof WaffleUpdateRequest>;

export const WaffleFilter = z
  .object({
    waffleName: z.string().max(15, "Waffle name is too long").optional(),
    waffleCategory: z
      .string()
      .max(15, "Waffle category is too long")
      .optional(),
  })
  .extend(SortOrderRequest.shape)
  .extend(WaffleSortFieldRequest.shape)
  .extend(PaginationRequest.shape);
export type WaffleFilter = z.infer<typeof WaffleFilter>;

export const CreateWaffleResponse = SuccessResponse(Waffle);
export type CreateWaffleResponse = z.infer<typeof CreateWaffleResponse>;

export const UpdateWaffleResponse = SuccessResponse(Waffle);
export type UpdateWaffleResponse = z.infer<typeof UpdateWaffleResponse>;

export const GetWaffleResponse = SuccessResponse(Waffle);
export type GetWaffleResponse = z.infer<typeof GetWaffleResponse>;

export const ListWaffleResponse = SuccessResponse(
  z.array(Waffle),
  PaginationResponse,
);
export type ListWaffleResponse = z.infer<typeof ListWaffleResponse>;
