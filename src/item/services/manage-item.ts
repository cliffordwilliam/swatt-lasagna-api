import { EntityManager } from "@mikro-orm/postgresql";
import { assignSafe } from "../../common/utils/assign-safe";
import { Item } from "../entities/item.entity";
import { ITEM_REPOSITORY } from "../repositories/item-repository";
import {
  ItemCreateRequest,
  ItemUpdateRequest,
  ItemFilter,
} from "../schemas/item";

export const MANAGE_ITEM = {
  async list(em: EntityManager, filters: ItemFilter) {
    return await ITEM_REPOSITORY.list(em, filters);
  },

  async getById(em: EntityManager, itemId: number) {
    return await ITEM_REPOSITORY.getByIdOrFail(em, itemId);
  },

  async update(
    em: EntityManager,
    updates: ItemUpdateRequest,
    itemId: number,
    flush = true,
  ) {
    const existingEntity = await ITEM_REPOSITORY.getByIdOrFail(em, itemId);
    assignSafe(updates, existingEntity);
    const saved = await ITEM_REPOSITORY.save(em, existingEntity);
    if (flush) {
      await em.flush();
    }
    return saved;
  },

  async create(em: EntityManager, itemData: ItemCreateRequest, flush = true) {
    const item = new Item();
    assignSafe(itemData, item);
    const saved = await ITEM_REPOSITORY.save(em, item);
    if (flush) {
      await em.flush();
    }
    return saved;
  },
};
