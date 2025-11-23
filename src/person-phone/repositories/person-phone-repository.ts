import { EntityManager } from "@mikro-orm/postgresql";
import { PersonPhone } from "../entities/person-phone.entity";
import { Person } from "../../person/entities/person.entity";
import { FilterQuery } from "@mikro-orm/core";
import { PersonPhoneFilter } from "../schemas/person-phone";

export const PERSON_PHONE_REPOSITORY = {
  async getByIdOrFail(em: EntityManager, phoneId: number) {
    return em.findOneOrFail(PersonPhone, { phoneId }, { populate: ["person"] });
  },

  async list(em: EntityManager, filters: PersonPhoneFilter) {
    const conditions: FilterQuery<PersonPhone>[] = [];

    if (filters.personId !== undefined) {
      conditions.push({ person: { personId: filters.personId } });
    }

    if (filters.phoneNumber) {
      conditions.push({ phoneNumber: { $ilike: `%${filters.phoneNumber}%` } });
    }

    if (filters.preferred !== undefined) {
      conditions.push({ preferred: filters.preferred });
    }

    const where: FilterQuery<PersonPhone> =
      conditions.length === 0
        ? {}
        : filters.mode === "and"
          ? { $and: conditions }
          : { $or: conditions };

    const sortFieldMap: Record<string, keyof PersonPhone> = {
      phoneNumber: "phoneNumber",
      preferred: "preferred",
    };

    const sortField = sortFieldMap[filters.sortField] ?? "phoneNumber";

    const [entities, totalCount] = await em.findAndCount(PersonPhone, where, {
      limit: filters.pageSize,
      offset: (filters.page - 1) * filters.pageSize,
      orderBy: { [sortField]: filters.sortOrder },
      populate: ["person"],
    });

    const totalPages = Math.ceil(totalCount / filters.pageSize);

    return {
      data: entities.map((entity) => ({
        ...entity,
        personId: entity.person.personId,
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

  async save(em: EntityManager, phone: PersonPhone, person: Person) {
    if (phone.preferred) {
      await em.nativeUpdate(
        PersonPhone,
        {
          person: { personId: person.personId },
          preferred: true,
          ...(phone.phoneId && { phoneId: { $ne: phone.phoneId } }),
        },
        { preferred: false },
      );
    }

    phone.person = person;
    em.persist(phone);

    return phone;
  },
};
