import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    res.status(500).send("global error boundary");
};
