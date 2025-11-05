import { z } from "zod";
import { SuccessResponse } from "../../api/schemas/api";

export const Waffle = z.object({
  waffle_id: z.int(),
  waffle_name: z.string(),
});

export const WaffleCreateRequest = z.object({
  waffle_name: z
    .string()
    .min(1, "Waffle name is required")
    .max(100, "Waffle name is too long"),
});
export type WaffleCreateRequest = z.infer<typeof WaffleCreateRequest>;

export const WaffleUpdateRequest = z.object({
  waffle_name: z
    .string()
    .min(1, "Waffle name is required")
    .max(100, "Waffle name is too long")
    .optional(),
});
export type WaffleUpdateRequest = z.infer<typeof WaffleUpdateRequest>;

export const WaffleFilter = z.object({
  waffle_name: z.string().max(100, "Waffle name is too long").optional(),
});
export type WaffleFilter = z.infer<typeof WaffleFilter>;

export const CreateWaffleResponse = SuccessResponse(Waffle);
export type CreateWaffleResponse = z.infer<typeof CreateWaffleResponse>;

export const UpdateWaffleResponse = SuccessResponse(Waffle);
export type UpdateWaffleResponse = z.infer<typeof UpdateWaffleResponse>;

export const GetWaffleResponse = SuccessResponse(Waffle);
export type GetWaffleResponse = z.infer<typeof GetWaffleResponse>;

export const ListWaffleResponse = SuccessResponse(z.array(Waffle));
export type ListWaffleResponse = z.infer<typeof ListWaffleResponse>;
