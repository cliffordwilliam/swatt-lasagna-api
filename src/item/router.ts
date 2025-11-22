import { Router } from "express";
import {
  ItemCreateRequest,
  ItemFilter,
  ItemUpdateRequest,
  ItemListResponse,
  ItemGetResponse,
  ItemCreateResponse,
  ItemUpdateResponse,
} from "./schemas/item";
import { MANAGE_ITEM } from "./services/manage-item";
import { IntRequest } from "../common/schemas/int-request";
import withTransaction from "../common/utils/transactional";

const router = Router();

router.get("/", async (req, res) => {
  const entities = await withTransaction(async (em) => {
    return await MANAGE_ITEM.list(em, ItemFilter.parse(req.query));
  });
  res.json(
    ItemListResponse.parse({
      success: true,
      data: entities.data,
      meta: entities.pagination,
    }),
  );
});

router.get("/:id", async (req, res) => {
  const entity = await withTransaction(async (em) => {
    return await MANAGE_ITEM.getById(em, IntRequest.parse(req.params.id));
  });
  res.json(ItemGetResponse.parse({ success: true, data: entity }));
});

router.post("/", async (req, res) => {
  const entity = await withTransaction(async (em) => {
    return await MANAGE_ITEM.create(em, ItemCreateRequest.parse(req.body));
  });
  res.json(ItemCreateResponse.parse({ success: true, data: entity }));
});

router.patch("/:id", async (req, res) => {
  const entity = await withTransaction(async (em) => {
    return await MANAGE_ITEM.update(
      em,
      ItemUpdateRequest.parse(req.body),
      IntRequest.parse(req.params.id),
    );
  });
  res.json(ItemUpdateResponse.parse({ success: true, data: entity }));
});

export default router;
