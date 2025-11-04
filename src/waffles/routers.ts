import { Router } from "express";
import { CreateWaffleResponse, ListWaffleResponse, WaffleCreateRequest, WaffleFilter } from "./schemas/waffle";
import { validate } from "../utils/validate";
import { ManageWaffle } from "./services/manage_waffle";

const waffleRouter = Router();

waffleRouter.get("/", async (req, res, _next) => {
    const waffles = ManageWaffle.list(validate(WaffleFilter, req.query));
    res.json(validate(ListWaffleResponse, waffles));
});

waffleRouter.post("/", async (req, res, _next) => {
    const created_waffle = ManageWaffle.create(validate(WaffleCreateRequest, req.body));
    res.json(validate(CreateWaffleResponse, created_waffle));
});

export default waffleRouter;

