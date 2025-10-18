import { z } from "zod";

export const WaffleCreateRequest = z.object({
    waffle_name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

export const CreateWaffleResponse = z.object({
    id: z.string(),
    name: z.string(),
});

export type WaffleCreateRequest = z.infer<typeof WaffleCreateRequest>;
export type CreateWaffleResponse = z.infer<typeof CreateWaffleResponse>;

