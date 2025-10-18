import { Router } from "express";
import { CreateWaffleResponse, WaffleCreateRequest } from "./schemas/waffle";
import { validateBody, validateResponse } from "../middlewares/validate";
import { ManageWaffle } from "./services/manage_waffle";

const waffleRouter = Router();

waffleRouter.post("/", validateBody(WaffleCreateRequest), async (req, res, next) => {
    const created_waffle = await ManageWaffle.create(req.body);
    res.json(validateResponse(CreateWaffleResponse, created_waffle));
});

export default waffleRouter;

