import { filterDefinedValues } from "../../common/utils/defined-entries";
import withTransaction from "../../common/utils/transactional";
import { Item } from "../entities/item.entity";
import { ITEM_REPOSITORY } from "../repositories/item-repository";
import {
  ItemCreateRequest,
  ItemUpdateRequest,
  ItemFilter,
} from "../schemas/item";

export const MANAGE_ITEM = {
  async list(filters: ItemFilter) {
    return withTransaction(async (em) => {
      return await ITEM_REPOSITORY.list(em, filters);
    });
  },

  async getById(itemId: number) {
    return withTransaction(async (em) => {
      return await ITEM_REPOSITORY.getByIdOrFail(em, itemId);
    });
  },

  async update(updates: ItemUpdateRequest, itemId: number) {
    return withTransaction(async (em) => {
      const existingEntity = await ITEM_REPOSITORY.getByIdOrFail(em, itemId);
      Object.assign(existingEntity, filterDefinedValues(updates));
      return await ITEM_REPOSITORY.save(em, existingEntity);
    });
  },

  async create(itemData: ItemCreateRequest) {
    return withTransaction(async (em) => {
      const item = new Item();
      Object.assign(item, filterDefinedValues(itemData));
      return await ITEM_REPOSITORY.save(em, item);
    });
  },
};
