import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ErrorResponse } from "../api/schemas/api";
import { NotFoundError } from "@mikro-orm/core";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    res.status(400).json(
      ErrorResponse.parse({
        success: false,
        error: {
          message: "Request validation error",
          details: err.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
            type: i.code,
          })),
        },
      }),
    );
    return;
  }
  if (err instanceof NotFoundError) {
    res.status(404).json(
      ErrorResponse.parse({
        success: false,
        error: {
          message: err.message,
        },
      }),
    );
    return;
  }
  res.status(500).json(
    ErrorResponse.parse({
      success: false,
      error: {
        message: "Internal server error",
      },
    }),
  );
}
