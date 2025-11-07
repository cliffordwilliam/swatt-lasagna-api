import { WaffleEntity } from "../entities/waffle.entity";
import { WaffleRepository } from "../repositories/waffle_repository";
import { WaffleCreateRequest, WaffleFilter } from "../schemas/waffle";

export const ManageWaffle = {
  async list(filters: WaffleFilter) {
    return await WaffleRepository.list(filters);
  },

  async create(waffle_data: WaffleCreateRequest) {
    const waffle = new WaffleEntity();
    waffle.waffle_name = waffle_data.waffle_name;
    waffle.waffle_category = waffle_data.waffle_category;
    return await WaffleRepository.create(waffle);
  },
};
