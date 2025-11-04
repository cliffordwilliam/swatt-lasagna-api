import { z } from "zod";

export const Waffle = z.object({
    waffle_id: z.string(),
    waffle_name: z.string(),
})

export const WaffleCreateRequest = z.object({
    waffle_name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});
export type WaffleCreateRequest = z.infer<typeof WaffleCreateRequest>;

export const WaffleUpdateRequest = z.object({
    waffle_name: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
});
export type WaffleUpdateRequest = z.infer<typeof WaffleUpdateRequest>;

export const WaffleFilter = z.object({
    waffle_name: z.string().optional(),
});
export type WaffleFilter = z.infer<typeof WaffleFilter>;

export const CreateWaffleResponse = Waffle;
export type CreateWaffleResponse = z.infer<typeof CreateWaffleResponse>;

export const UpdateWaffleResponse = Waffle;
export type UpdateWaffleResponse = z.infer<typeof UpdateWaffleResponse>;

export const GetWaffleResponse = Waffle;
export type GetWaffleResponse = z.infer<typeof GetWaffleResponse>;

export const ListWaffleResponse = z.array(Waffle);
export type ListWaffleResponse = z.infer<typeof ListWaffleResponse>;

