import { FilterQuery } from "@mikro-orm/core";
import { getEM } from "../../core/database/adapter";
import { WaffleEntity } from "../entities/waffle.entity";
import { WaffleFilter } from "../schemas/waffle";

export const WaffleRepository = {
  async list(filters: WaffleFilter) {
    const conditions: FilterQuery<WaffleEntity>[] = [];
    if (filters.waffle_name) {
      conditions.push({ waffle_name: { $ilike: `%${filters.waffle_name}%` } });
    }
    if (filters.waffle_category) {
      conditions.push({
        waffle_category: { $ilike: `%${filters.waffle_category}%` },
      });
    }
    const where: FilterQuery<WaffleEntity> =
      filters.mode === "and" ? { $and: conditions } : { $or: conditions };
    const em = await getEM();
    return await em.find(WaffleEntity, where);
  },

  async create(waffle: WaffleEntity) {
    const em = await getEM();
    await em.persistAndFlush(waffle);
    return waffle;
  },
};
