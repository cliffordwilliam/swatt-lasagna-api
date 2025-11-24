import { EntityManager } from "@mikro-orm/postgresql";
import { assignSafe } from "../../common/utils/assign-safe";
import { Person } from "../entities/person.entity";
import { PERSON_REPOSITORY } from "../repositories/person-repository";
import {
  PersonCreateRequest,
  PersonUpdateRequest,
  PersonFilter,
} from "../schemas/person";
import { MANAGE_PERSON_PHONE } from "../../person-phone/services/manage-person-phone";
import { MANAGE_PERSON_ADDRESS } from "../../person-address/services/manage-person-address";

export const MANAGE_PERSON = {
  async list(em: EntityManager, filters: PersonFilter) {
    return await PERSON_REPOSITORY.list(em, filters);
  },

  async getById(em: EntityManager, personId: number) {
    const person = await PERSON_REPOSITORY.getByIdOrFail(em, personId);
    return {
      ...person,
      phones: Array.from(person.phones).map((phone) => ({
        ...phone,
        personId: phone.person.personId,
      })),
      addresses: Array.from(person.addresses).map((address) => ({
        ...address,
        personId: address.person.personId,
      })),
    };
  },

  async create(
    em: EntityManager,
    personData: PersonCreateRequest,
    flush = true,
  ) {
    const createdPerson = await this.createPersonEntity(em, personData, flush);

    return {
      ...createdPerson,
      phones: Array.from(createdPerson.phones).map((phone) => ({
        ...phone,
        personId: phone.person.personId,
      })),
      addresses: Array.from(createdPerson.addresses).map((address) => ({
        ...address,
        personId: address.person.personId,
      })),
    };
  },

  async update(
    em: EntityManager,
    updates: PersonUpdateRequest,
    personId: number,
    flush = true,
  ) {
    const existingPerson = await this.updatePersonEntity(
      em,
      updates,
      personId,
      flush,
    );

    return {
      ...existingPerson,
      phones: Array.from(existingPerson.phones).map((phone) => ({
        ...phone,
        personId: phone.person.personId,
      })),
      addresses: Array.from(existingPerson.addresses).map((address) => ({
        ...address,
        personId: address.person.personId,
      })),
    };
  },

  async createPersonEntity(
    em: EntityManager,
    personData: PersonCreateRequest,
    flush = true,
  ): Promise<Person> {
    const {
      phoneNumber,
      address: addressValue,
      ...personDataRest
    } = personData;

    const person = new Person();
    assignSafe(personDataRest, person);

    em.persist(person);

    if (phoneNumber) {
      await MANAGE_PERSON_PHONE.create(
        em,
        {
          personId: person.personId,
          phoneNumber,
          preferred: true,
        },
        false,
        person,
      );
    }
    if (addressValue) {
      await MANAGE_PERSON_ADDRESS.create(
        em,
        {
          personId: person.personId,
          address: addressValue,
          preferred: true,
        },
        false,
        person,
      );
    }

    if (flush) {
      await em.flush();
    }

    await PERSON_REPOSITORY.populateRelations(em, person);

    return person;
  },

  async updatePersonEntity(
    em: EntityManager,
    updates: PersonUpdateRequest,
    personId: number,
    flush = true,
  ): Promise<Person> {
    const existingPerson = await PERSON_REPOSITORY.getByIdOrFail(em, personId);

    assignSafe(updates, existingPerson);

    if (updates.phone !== undefined) {
      const { phoneId, ...phoneData } = updates.phone;
      if (phoneId !== undefined) {
        await MANAGE_PERSON_PHONE.update(
          em,
          phoneId,
          phoneData,
          personId,
          false,
        );
      } else {
        await MANAGE_PERSON_PHONE.create(
          em,
          { personId, ...phoneData },
          false,
          existingPerson,
        );
      }
    }

    if (updates.address !== undefined) {
      const { addressId, ...addressData } = updates.address;
      if (addressId !== undefined) {
        await MANAGE_PERSON_ADDRESS.update(
          em,
          addressId,
          addressData,
          personId,
          false,
        );
      } else {
        await MANAGE_PERSON_ADDRESS.create(
          em,
          { personId, ...addressData },
          false,
          existingPerson,
        );
      }
    }

    em.persist(existingPerson);

    if (flush) {
      await em.flush();
    }

    await PERSON_REPOSITORY.populateRelations(em, existingPerson);

    return existingPerson;
  },
};
