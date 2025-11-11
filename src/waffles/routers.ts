import { Router } from "express";
import {
  CreateWaffleResponse,
  GetWaffleResponse,
  ListWaffleResponse,
  UpdateWaffleResponse,
  WaffleCreateRequest,
  WaffleFilter,
  WaffleUpdateRequest,
} from "./schemas/waffle";
import { ManageWaffle } from "./services/manage_waffle";
import { IntRequest } from "../common/schemas/int_schema";

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

router.get("/:id", async (req, res) => {
  const waffle = await ManageWaffle.get_by_id(IntRequest.parse(req.params.id));
  res.json(GetWaffleResponse.parse({ success: true, data: waffle }));
});

router.post("/", async (req, res) => {
  const waffle = await ManageWaffle.create(WaffleCreateRequest.parse(req.body));
  res.json(CreateWaffleResponse.parse({ success: true, data: waffle }));
});

router.patch("/:id", async (req, res) => {
  const waffle = await ManageWaffle.update(
    WaffleUpdateRequest.parse(req.body),
    IntRequest.parse(req.params.id),
  );
  res.json(UpdateWaffleResponse.parse({ success: true, data: waffle }));
});

export default router;
