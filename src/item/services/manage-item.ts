import { filterDefinedValues } from "../../common/utils/defined-entries";
import { Item } from "../entities/item.entity";
import { ItemRepository } from "../repositories/item-repository";
import {
  ItemCreateRequest,
  ItemUpdateRequest,
  ItemFilter,
} from "../schemas/item";

export const ManageItem = {
  async list(filters: ItemFilter) {
    return await ItemRepository.list(filters);
  },

  async getById(itemId: number) {
    return await ItemRepository.getByIdOrFail(itemId);
  },

  async update(updates: ItemUpdateRequest, itemId: number) {
    const existingEntity = await ItemRepository.getByIdOrFail(itemId);
    Object.assign(existingEntity, filterDefinedValues(updates));
    return await ItemRepository.save(existingEntity);
  },

  async create(itemData: ItemCreateRequest) {
    const item = new Item();
    Object.assign(item, filterDefinedValues(itemData));
    return await ItemRepository.save(item);
  },
};
