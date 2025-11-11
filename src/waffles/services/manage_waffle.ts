import { filterDefinedValues } from "../../common/utils/defined_entries";
import { WaffleEntity } from "../entities/waffle.entity";
import { WaffleRepository } from "../repositories/waffle_repository";
import {
  WaffleCreateRequest,
  WaffleFilter,
  WaffleUpdateRequest,
} from "../schemas/waffle";

export const ManageWaffle = {
  async list(filters: WaffleFilter) {
    return await WaffleRepository.list(filters);
  },

  async get_by_id(waffle_id: number) {
    return await WaffleRepository.get_by_id_or_fail(waffle_id);
  },

  async update(updates: WaffleUpdateRequest, waffle_id: number) {
    const existing_waffle = await WaffleRepository.get_by_id_or_fail(waffle_id);
    Object.assign(existing_waffle, filterDefinedValues(updates));
    return await WaffleRepository.save(existing_waffle);
  },

  async create(waffle_data: WaffleCreateRequest) {
    const waffle = new WaffleEntity();
    Object.assign(waffle, filterDefinedValues(waffle_data));
    return await WaffleRepository.save(waffle);
  },
};
