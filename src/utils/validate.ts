import { z, ZodType } from "zod";

export const validate = <T extends ZodType>(schema: T, data: unknown): z.infer<T> => {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid response")
    }
    return result.data;
};

