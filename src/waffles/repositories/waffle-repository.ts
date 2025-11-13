import { FilterQuery } from "@mikro-orm/core";
import { getEM } from "../../core/database/adapter";
import { WaffleEntity } from "../entities/waffle.entity";
import { WaffleFilter } from "../schemas/waffle";

export const WaffleRepository = {
  async getByIdOrFail(waffleId: number) {
    const em = await getEM();
    return em.findOneOrFail(WaffleEntity, { waffleId });
  },

  async list(filters: WaffleFilter) {
    const em = await getEM();
    const conditions: FilterQuery<WaffleEntity>[] = [];

    if (filters.waffleName) {
      conditions.push({ waffleName: { $ilike: `%${filters.waffleName}%` } });
    }

    if (filters.waffleCategory) {
      conditions.push({
        waffleCategory: { $ilike: `%${filters.waffleCategory}%` },
      });
    }

    const where: FilterQuery<WaffleEntity> =
      filters.mode === "and" ? { $and: conditions } : { $or: conditions };

    const sortFieldMap: Record<string, keyof WaffleEntity> = {
      waffleId: "waffleId",
      waffleName: "waffleName",
      waffleCategory: "waffleCategory",
    };
    const sortField = sortFieldMap[filters.sortField] ?? "waffleName";

    const [waffles, totalCount] = await em.findAndCount(WaffleEntity, where, {
      limit: filters.pageSize,
      offset: (filters.page - 1) * filters.pageSize,
      orderBy: { [sortField]: filters.sortOrder },
    });

    const totalPages = Math.ceil(totalCount / filters.pageSize);

    return {
      data: waffles,
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        totalCount,
        totalPages,
        hasNext: filters.page < totalPages,
        hasPrevious: filters.page > 1,
      },
    };
  },

  async save(waffle: WaffleEntity) {
    const em = await getEM();
    await em.persistAndFlush(waffle);
    return waffle;
  },
};
