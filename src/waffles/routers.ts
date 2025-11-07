import { Router } from "express";
import {
  CreateWaffleResponse,
  ListWaffleResponse,
  WaffleCreateRequest,
  WaffleFilter,
} from "./schemas/waffle";
import { ManageWaffle } from "./services/manage_waffle";

const router = Router();

router.get("/", async (req, res) => {
  const waffles = await ManageWaffle.list(WaffleFilter.parse(req.query));
  res.json(
    ListWaffleResponse.parse({
      success: true,
      data: waffles.data,
      meta: waffles.pagination,
    }),
  );
});

router.post("/", async (req, res) => {
  const waffle = await ManageWaffle.create(WaffleCreateRequest.parse(req.body));
  res.json(CreateWaffleResponse.parse({ success: true, data: waffle }));
});

export default router;
