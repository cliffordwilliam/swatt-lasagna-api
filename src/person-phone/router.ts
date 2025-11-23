import { Router } from "express";
import {
  PersonPhoneCreateRequest,
  PersonPhoneCreateResponse,
  PersonPhoneUpdateRequest,
  PersonPhoneUpdateResponse,
  PersonPhoneFilter,
  PersonPhoneListResponse,
  PersonPhoneGetResponse,
} from "./schemas/person-phone";
import { MANAGE_PERSON_PHONE } from "./services/manage-person-phone";
import { IntRequest } from "../common/schemas/int-request";
import withTransaction from "../common/utils/transactional";

const router = Router();

router.get("/", async (req, res) => {
  const entities = await withTransaction(async (em) => {
    return await MANAGE_PERSON_PHONE.list(
      em,
      PersonPhoneFilter.parse(req.query),
    );
  });
  res.json(
    PersonPhoneListResponse.parse({
      success: true,
      data: entities.data,
      meta: entities.pagination,
    }),
  );
});

router.get("/:id", async (req, res) => {
  const entity = await withTransaction(async (em) => {
    return await MANAGE_PERSON_PHONE.getById(
      em,
      IntRequest.parse(req.params.id),
    );
  });
  res.json(PersonPhoneGetResponse.parse({ success: true, data: entity }));
});

router.post("/", async (req, res) => {
  const entity = await withTransaction(async (em) => {
    return await MANAGE_PERSON_PHONE.create(
      em,
      PersonPhoneCreateRequest.parse(req.body),
    );
  });
  res.json(PersonPhoneCreateResponse.parse({ success: true, data: entity }));
});

router.patch("/:id", async (req, res) => {
  const phoneId = IntRequest.parse(req.params.id);
  const personId = IntRequest.parse(req.query.personId as string);
  const entity = await withTransaction(async (em) => {
    return await MANAGE_PERSON_PHONE.update(
      em,
      phoneId,
      PersonPhoneUpdateRequest.parse(req.body),
      personId,
    );
  });
  res.json(PersonPhoneUpdateResponse.parse({ success: true, data: entity }));
});

export default router;
