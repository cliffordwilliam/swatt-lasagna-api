import { FilterQuery } from "@mikro-orm/core";
import { getEM } from "../../core/database/adapter";
import { WaffleEntity } from "../entities/waffle.entity";
import { WaffleFilter } from "../schemas/waffle";

export const WaffleRepository = {
  async list(filters: WaffleFilter) {
    const em = await getEM();
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

    const offset = (filters.page - 1) * filters.page_size;

    const [waffles, total_count] = await em.findAndCount(WaffleEntity, where, {
      limit: filters.page_size,
      offset,
      orderBy: { waffle_id: "asc" },
    });

    const total_pages = Math.ceil(total_count / filters.page_size);

    return {
      data: waffles,
      pagination: {
        page: filters.page,
        page_size: filters.page_size,
        total_count: total_count,
        total_pages: total_pages,
        has_next: filters.page < total_pages,
        has_previous: filters.page > 1,
      },
    };
  },

  async create(waffle: WaffleEntity) {
    const em = await getEM();
    await em.persistAndFlush(waffle);
    return waffle;
  },
};
