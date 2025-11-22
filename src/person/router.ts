import { Router } from "express";
import {
  PersonCreateRequest,
  PersonCreateResponse,
  PersonUpdateRequest,
  PersonUpdateResponse,
  PersonFilter,
  PersonListResponse,
  PersonGetResponse,
} from "./schemas/person";
import { MANAGE_PERSON } from "./services/manage-person";
import { IntRequest } from "../common/schemas/int-request";
import withTransaction from "../common/utils/transactional";

const router = Router();

router.get("/", async (req, res) => {
  const entities = await withTransaction(async (em) => {
    return await MANAGE_PERSON.list(em, PersonFilter.parse(req.query));
  });
  res.json(
    PersonListResponse.parse({
      success: true,
      data: entities.data,
      meta: entities.pagination,
    }),
  );
});

router.get("/:id", async (req, res) => {
  const entity = await withTransaction(async (em) => {
    return await MANAGE_PERSON.getById(em, IntRequest.parse(req.params.id));
  });
  res.json(PersonGetResponse.parse({ success: true, data: entity }));
});

router.post("/", async (req, res) => {
  const entity = await withTransaction(async (em) => {
    return await MANAGE_PERSON.create(em, PersonCreateRequest.parse(req.body));
  });
  res.json(PersonCreateResponse.parse({ success: true, data: entity }));
});

router.patch("/:id", async (req, res) => {
  const entity = await withTransaction(async (em) => {
    return await MANAGE_PERSON.update(
      em,
      PersonUpdateRequest.parse(req.body),
      IntRequest.parse(req.params.id),
    );
  });
  res.json(PersonUpdateResponse.parse({ success: true, data: entity }));
});

export default router;
