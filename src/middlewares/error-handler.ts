import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ErrorResponse } from "../api/schemas/api";
import { NotFoundError } from "@mikro-orm/core";

export default function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  console.log(err);
  if (err instanceof ZodError) {
    res.status(422).json(
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
          code: "RESOURCE_NOT_FOUND",
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
