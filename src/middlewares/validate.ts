import { RequestHandler } from "express";
import { z, ZodType } from "zod";

export const validateBody = <T extends ZodType>(schema: T): RequestHandler<unknown, unknown, z.infer<T>> => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return next(new z.ZodError(result.error.issues));
        }
        req.body = result.data;
        next();
    };
};

export const validateResponse = <T extends ZodType>(schema: T, data: unknown): z.infer<T> => {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid response")
    }
    return result.data;
};

