import "reflect-metadata";
import express from "express";
import waffleRouter from "./waffles/routers";
import { errorHandler } from "./middlewares/error_handler";
import { getORM } from "./core/database/adapter";
import { env } from "./core/config/constants";
import http_logger from "./middlewares/http_logger";
import logger from "./core/logging/logger";

(async () => {
  await getORM();

  const app = express();

  app.use(http_logger);

  app.use(express.json());

  app.use("/waffles", waffleRouter);

  app.use(errorHandler);

  app.get("/healthz", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "Server listening");
  });
})();
