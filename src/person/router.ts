import { Router } from "express";
import { PersonCreateRequest, PersonCreateResponse } from "./schemas/person";
import { MANAGE_PERSON } from "./services/manage-person";

const router = Router();

router.post("/", async (req, res) => {
  const entity = await MANAGE_PERSON.create(
    PersonCreateRequest.parse(req.body),
  );
  res.json(PersonCreateResponse.parse({ success: true, data: entity }));
});

export default router;
