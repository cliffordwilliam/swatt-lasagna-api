import { FilterQuery } from "@mikro-orm/core";
import { getEM } from "../../core/database/adapter";
import { Item } from "../entities/item.entity";
import { ItemFilter } from "../schemas/item";

export const ItemRepository = {
  async getByIdOrFail(itemId: number) {
    const em = await getEM();
    return em.findOneOrFail(Item, { itemId });
  },

  async list(filters: ItemFilter) {
    const em = await getEM();
    const conditions: FilterQuery<Item>[] = [];

    if (filters.itemName) {
      conditions.push({ itemName: { $ilike: `%${filters.itemName}%` } });
    }

    if (filters.price !== undefined) {
      conditions.push({ price: filters.price });
    }

    const where: FilterQuery<Item> =
      conditions.length === 0
        ? {}
        : filters.mode === "and"
          ? { $and: conditions }
          : { $or: conditions };

    const sortFieldMap: Record<string, keyof Item> = {
      itemName: "itemName",
      price: "price",
    };

    const sortField = sortFieldMap[filters.sortField] ?? "itemName";

    const [entities, totalCount] = await em.findAndCount(Item, where, {
      limit: filters.pageSize,
      offset: (filters.page - 1) * filters.pageSize,
      orderBy: { [sortField]: filters.sortOrder },
    });

    const totalPages = Math.ceil(totalCount / filters.pageSize);

    return {
      data: entities,
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

  async save(item: Item) {
    const em = await getEM();
    await em.persistAndFlush(item);
    return item;
  },
};
