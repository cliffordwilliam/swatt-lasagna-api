import { Router } from "express";
import {
  ItemCreateRequest,
  ItemFilter,
  ItemUpdateRequest,
  ListItemResponse,
  GetItemResponse,
  CreateItemResponse,
  UpdateItemResponse,
} from "./schemas/item";
import { MANAGE_ITEM } from "./services/manage-item";
import { IntRequest } from "../common/schemas/int-request";

const router = Router();

router.get("/", async (req, res) => {
  const entities = await MANAGE_ITEM.list(ItemFilter.parse(req.query));
  res.json(
    ListItemResponse.parse({
      success: true,
      data: entities.data,
      meta: entities.pagination,
    }),
  );
});

router.get("/:id", async (req, res) => {
  const entity = await MANAGE_ITEM.getById(IntRequest.parse(req.params.id));
  res.json(GetItemResponse.parse({ success: true, data: entity }));
});

router.post("/", async (req, res) => {
  const entity = await MANAGE_ITEM.create(ItemCreateRequest.parse(req.body));
  res.json(CreateItemResponse.parse({ success: true, data: entity }));
});

router.patch("/:id", async (req, res) => {
  const entity = await MANAGE_ITEM.update(
    ItemUpdateRequest.parse(req.body),
    IntRequest.parse(req.params.id),
  );
  res.json(UpdateItemResponse.parse({ success: true, data: entity }));
});

export default router;
