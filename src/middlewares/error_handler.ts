import { NextFunction, Request, Response } from "express";
import { success, ZodError } from "zod";
import { ErrorResponse } from "../api/schemas/api";
import { validate } from "../utils/validate";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ZodError) {
        res.status(400).json(validate(
            ErrorResponse,
            {
                success: false,
                error: {
                    message: "Request validation error",
                    code: 123,
                    details: err.issues.map((i) => ({
                        field: i.path.join("."),
                        message: i.message,
                        type: i.code,
                    })),
                },
            }
        ));
        return
    }
    res.status(500).send("global error boundary");
};
