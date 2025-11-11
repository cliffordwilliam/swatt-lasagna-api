import "reflect-metadata";
import express from "express";
import waffleRouter from "./waffles/routers";
import { errorHandler } from "./middlewares/error_handler";
import { getORM } from "./core/database/adapter";
import { env } from "./core/config/constants";

(async () => {
  await getORM();

  const app = express();

  app.use(express.json());

  app.use("/waffles", waffleRouter);

  app.use(errorHandler);

  app.get("/healthz", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT}/`);
  });
})();
