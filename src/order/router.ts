import { Router } from "express";
import {
  OrderCreateRequest,
  OrderCreateResponse,
  OrderGetResponse,
} from "./schemas/order";
import { MANAGE_ORDER } from "./services/manage-order";
import { IntRequest } from "../common/schemas/int-request";
import withTransaction from "../common/utils/transactional";

const router = Router();

router.get("/:id", async (req, res) => {
  const entity = await withTransaction(async (em) => {
    return await MANAGE_ORDER.getById(em, IntRequest.parse(req.params.id));
  });
  res.json(OrderGetResponse.parse({ success: true, data: entity }));
});

router.post("/", async (req, res) => {
  const entity = await withTransaction(async (em) => {
    return await MANAGE_ORDER.create(em, OrderCreateRequest.parse(req.body));
  });
  res.json(OrderCreateResponse.parse({ success: true, data: entity }));
});

export default router;
