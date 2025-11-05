import { Router } from "express";
import {
  CreateWaffleResponse,
  ListWaffleResponse,
  WaffleCreateRequest,
  WaffleFilter,
} from "./schemas/waffle";
import { ManageWaffle } from "./services/manage_waffle";

const waffleRouter = Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
waffleRouter.get("/", async (req, res, _next) => {
  const waffles = await ManageWaffle.list(WaffleFilter.parse(req.query));
  res.json(ListWaffleResponse.parse({ success: true, data: waffles }));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
waffleRouter.post("/", async (req, res, _next) => {
  const waffle = await ManageWaffle.create(WaffleCreateRequest.parse(req.body));
  res.json(CreateWaffleResponse.parse({ success: true, data: waffle }));
});

export default waffleRouter;
