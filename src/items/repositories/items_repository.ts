import { getEM } from "../../core/database/adapter";
import { ItemEntity } from "../entities/items.entity";

export const ItemRepository = {
  async get_by_id_or_fail(id: number) {
    const em = await getEM();
    return em.findOneOrFail(ItemEntity, { id });
  },
  async save(item: ItemEntity) {
    const em = await getEM();
    await em.persistAndFlush(item);
    return item;
  },
  async list() {
    const em = await getEM();
    const items = await em.findAll(ItemEntity);
    return {
      data: items,
      pagination: {},
    };
  },
};
