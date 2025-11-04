import { WaffleRepository } from "../repositories/waffle_repository";
import { WaffleCreateRequest, WaffleFilter } from "../schemas/waffle";

export const ManageWaffle = {
  list(filters: WaffleFilter) {
    return WaffleRepository.list(filters);
  },

  create(waffle_data: WaffleCreateRequest) {
    return WaffleRepository.create(waffle_data);
  },
};
