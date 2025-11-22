import "reflect-metadata";
import express from "express";
import itemRouter from "./item/router";
import personRouter from "./person/router";
import errorHandler from "./middlewares/error-handler";
import { getORM } from "./core/database/adapter";
import { ENV } from "./core/config/constants";
import httpLogger from "./middlewares/http-logger";
import logger from "./core/logging/logger";
import openApiDocument from "./core/swagger/swagger";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

(async () => {
  await getORM();

  const app = express();

  app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use(httpLogger);

  app.use(express.json());

  app.use("/item", itemRouter);
  app.use("/person", personRouter);

  app.use(errorHandler);

  app.get("/healthz", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.listen(ENV.PORT, () => {
    logger.info({ port: ENV.PORT }, "Server listening");
    logger.info("Documentation at: http://localhost:3000/docs");
    logger.info(
      "Adminer at: http://localhost:8080/?pgsql=postgres&username=postgres&db=swatt_lasagna_api&password=postgres",
    );
  });
})();
