import { FilterQuery } from "@mikro-orm/core";
import { Item } from "../entities/item.entity";
import { ItemFilter } from "../schemas/item";
import { EntityManager } from "@mikro-orm/postgresql";

export const ITEM_REPOSITORY = {
  async getByIdOrFail(em: EntityManager, itemId: number) {
    return em.findOneOrFail(Item, { itemId });
  },

  async getByIds(em: EntityManager, itemIds: number[]) {
    if (itemIds.length === 0) {
      return [];
    }
    return em.find(Item, { itemId: { $in: itemIds } });
  },

  async list(em: EntityManager, filters: ItemFilter) {
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

  async save(em: EntityManager, item: Item) {
    em.persist(item);
    return item;
  },
};
