import "reflect-metadata";
import express from "express";
import waffleRouter from "./waffles/routers";
import { errorHandler } from "./middlewares/error_handler";
import { getORM } from "./core/database/adapter";
import { env } from "./core/config/constants";

(async () => {
  const orm = await getORM();

  const shutdown = async () => {
    await orm.close(true);
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  const app = express();

  app.use(express.json());

  app.use("/waffles", waffleRouter);

  app.use(errorHandler);

  app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT}/`);
  });
})();
