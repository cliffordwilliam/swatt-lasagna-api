import { Router } from "express";
import {
  PersonAddressCreateRequest,
  PersonAddressCreateResponse,
  PersonAddressUpdateRequest,
  PersonAddressUpdateResponse,
  PersonAddressFilter,
  PersonAddressListResponse,
  PersonAddressGetResponse,
} from "./schemas/person-address";
import { MANAGE_PERSON_ADDRESS } from "./services/manage-person-address";
import { IntRequest } from "../common/schemas/int-request";
import withTransaction from "../common/utils/transactional";

const router = Router();

router.get("/", async (req, res) => {
  const entities = await withTransaction(async (em) => {
    return await MANAGE_PERSON_ADDRESS.list(
      em,
      PersonAddressFilter.parse(req.query),
    );
  });
  res.json(
    PersonAddressListResponse.parse({
      success: true,
      data: entities.data,
      meta: entities.pagination,
    }),
  );
});

router.get("/:id", async (req, res) => {
  const entity = await withTransaction(async (em) => {
    return await MANAGE_PERSON_ADDRESS.getById(
      em,
      IntRequest.parse(req.params.id),
    );
  });
  res.json(PersonAddressGetResponse.parse({ success: true, data: entity }));
});

router.post("/", async (req, res) => {
  const entity = await withTransaction(async (em) => {
    return await MANAGE_PERSON_ADDRESS.create(
      em,
      PersonAddressCreateRequest.parse(req.body),
    );
  });
  res.json(PersonAddressCreateResponse.parse({ success: true, data: entity }));
});

router.patch("/:id", async (req, res) => {
  const addressId = IntRequest.parse(req.params.id);
  const personId = IntRequest.parse(req.query.personId as string);
  const entity = await withTransaction(async (em) => {
    return await MANAGE_PERSON_ADDRESS.update(
      em,
      addressId,
      PersonAddressUpdateRequest.parse(req.body),
      personId,
    );
  });
  res.json(PersonAddressUpdateResponse.parse({ success: true, data: entity }));
});

export default router;
