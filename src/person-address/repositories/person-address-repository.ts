import { EntityManager } from "@mikro-orm/postgresql";
import { PersonAddress } from "../entities/person-address.entity";
import { Person } from "../../person/entities/person.entity";
import { FilterQuery } from "@mikro-orm/core";
import { PersonAddressFilter } from "../schemas/person-address";

export const PERSON_ADDRESS_REPOSITORY = {
  async getByIdOrFail(em: EntityManager, addressId: number) {
    return em.findOneOrFail(
      PersonAddress,
      { addressId },
      { populate: ["person"] },
    );
  },

  async list(em: EntityManager, filters: PersonAddressFilter) {
    const conditions: FilterQuery<PersonAddress>[] = [];

    if (filters.personId !== undefined) {
      conditions.push({ person: { personId: filters.personId } });
    }

    if (filters.address) {
      conditions.push({ address: { $ilike: `%${filters.address}%` } });
    }

    if (filters.preferred !== undefined) {
      conditions.push({ preferred: filters.preferred });
    }

    const where: FilterQuery<PersonAddress> =
      conditions.length === 0
        ? {}
        : filters.mode === "and"
          ? { $and: conditions }
          : { $or: conditions };

    const sortFieldMap: Record<string, keyof PersonAddress> = {
      address: "address",
      preferred: "preferred",
    };

    const sortField = sortFieldMap[filters.sortField] ?? "address";

    const [entities, totalCount] = await em.findAndCount(PersonAddress, where, {
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

  async toggleDownPreferred(
    em: EntityManager,
    address: PersonAddress,
    person: Person,
  ) {
    if (address.preferred) {
      const existingPreferred = await em.find(PersonAddress, {
        person: { personId: person.personId },
        preferred: true,
        ...(address.addressId && { addressId: { $ne: address.addressId } }),
      });

      existingPreferred.forEach((addr) => {
        addr.preferred = false;
      });
    }
  },
};
