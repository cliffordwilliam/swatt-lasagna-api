import "reflect-metadata";
import express from "express";
import itemRouter from "./item/routers";
import waffleRouter from "./waffles/routers";
import errorHandler from "./middlewares/error-handler";
import { getORM } from "./core/database/adapter";
import { ENV } from "./core/config/constants";
import httpLogger from "./middlewares/http-logger";
import logger from "./core/logging/logger";

(async () => {
  await getORM();

  const app = express();

  app.use(httpLogger);

  app.use(express.json());

  app.use("/item", itemRouter);
  app.use("/waffles", waffleRouter);

  app.use(errorHandler);

  app.get("/healthz", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.listen(ENV.PORT, () => {
    logger.info({ port: ENV.PORT }, "Server listening");
  });
})();
