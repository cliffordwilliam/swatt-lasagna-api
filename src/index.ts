import "reflect-metadata";
import express from "express";
import waffleRouter from "./waffles/routers";
import { errorHandler } from "./middlewares/error_handler";
import { getORM } from "./orm";

(async () => {
  await getORM();
})();

const app = express();

app.use(express.json());

app.use("/waffles", waffleRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log(`Server running at http://localhost:${3000}/`);
});
