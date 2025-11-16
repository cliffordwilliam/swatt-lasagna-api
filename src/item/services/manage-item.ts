import { filterDefinedValues } from "../../common/utils/defined-entries";
import { Item } from "../entities/item.entity";
import { ITEM_REPOSITORY } from "../repositories/item-repository";
import {
  ItemCreateRequest,
  ItemUpdateRequest,
  ItemFilter,
} from "../schemas/item";

export const MANAGE_ITEM = {
  async list(filters: ItemFilter) {
    return await ITEM_REPOSITORY.list(filters);
  },

  async getById(itemId: number) {
    return await ITEM_REPOSITORY.getByIdOrFail(itemId);
  },

  async update(updates: ItemUpdateRequest, itemId: number) {
    const existingEntity = await ITEM_REPOSITORY.getByIdOrFail(itemId);
    Object.assign(existingEntity, filterDefinedValues(updates));
    return await ITEM_REPOSITORY.save(existingEntity);
  },

  async create(itemData: ItemCreateRequest) {
    const item = new Item();
    Object.assign(item, filterDefinedValues(itemData));
    return await ITEM_REPOSITORY.save(item);
  },
};
