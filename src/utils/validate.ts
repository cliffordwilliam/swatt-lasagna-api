import { z, ZodError, ZodType } from "zod";

export const validate = <T extends ZodType>(schema: T, data: unknown): z.infer<T> => {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new ZodError(result.error.issues);
    }
    return result.data;
};

