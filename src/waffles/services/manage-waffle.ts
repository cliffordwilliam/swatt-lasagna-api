import { filterDefinedValues } from "../../common/utils/defined-entries";
import { WaffleEntity } from "../entities/waffle.entity";
import { WaffleRepository } from "../repositories/waffle-repository";
import {
  WaffleCreateRequest,
  WaffleFilter,
  WaffleUpdateRequest,
} from "../schemas/waffle";

export const ManageWaffle = {
  async list(filters: WaffleFilter) {
    return await WaffleRepository.list(filters);
  },

  async getById(waffleId: number) {
    return await WaffleRepository.getByIdOrFail(waffleId);
  },

  async update(updates: WaffleUpdateRequest, waffleId: number) {
    const existingWaffle = await WaffleRepository.getByIdOrFail(waffleId);
    Object.assign(existingWaffle, filterDefinedValues(updates));
    return await WaffleRepository.save(existingWaffle);
  },

  async create(waffleData: WaffleCreateRequest) {
    const waffle = new WaffleEntity();
    Object.assign(waffle, filterDefinedValues(waffleData));
    return await WaffleRepository.save(waffle);
  },
};
