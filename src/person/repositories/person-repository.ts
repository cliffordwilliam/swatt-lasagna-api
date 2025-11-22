import { FilterQuery } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Person } from "../entities/person.entity";
import { PersonFilter } from "../schemas/person";

export const PERSON_REPOSITORY = {
  async getByIdOrFail(em: EntityManager, personId: number) {
    return em.findOneOrFail(Person, { personId });
  },

  async list(em: EntityManager, filters: PersonFilter) {
    const conditions: FilterQuery<Person>[] = [];

    if (filters.personName) {
      conditions.push({ personName: { $ilike: `%${filters.personName}%` } });
    }

    const where: FilterQuery<Person> =
      conditions.length === 0
        ? {}
        : filters.mode === "and"
          ? { $and: conditions }
          : { $or: conditions };

    const sortFieldMap: Record<string, keyof Person> = {
      personName: "personName",
    };

    const sortField = sortFieldMap[filters.sortField] ?? "personName";

    const [entities, totalCount] = await em.findAndCount(Person, where, {
      limit: filters.pageSize,
      offset: (filters.page - 1) * filters.pageSize,
      orderBy: { [sortField]: filters.sortOrder },
      populate: ["phones", "addresses"],
    });

    const totalPages = Math.ceil(totalCount / filters.pageSize);

    return {
      data: entities.map((entity) => ({
        ...entity,
        phones: Array.from(entity.phones),
        addresses: Array.from(entity.addresses),
      })),
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

  async save(em: EntityManager, person: Person) {
    em.persist(person);
    return person;
  },
};
