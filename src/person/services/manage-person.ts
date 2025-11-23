import { EntityManager } from "@mikro-orm/postgresql";
import { assignSafe } from "../../common/utils/assign-safe";
import { Person } from "../entities/person.entity";
import { PERSON_REPOSITORY } from "../repositories/person-repository";
import {
  PersonCreateRequest,
  PersonUpdateRequest,
  PersonFilter,
} from "../schemas/person";
import { PersonPhone } from "../../person-phone/entities/person-phone.entity";
import { PersonAddress } from "../../person-address/entities/person-address.entity";
import { PERSON_PHONE_REPOSITORY } from "../../person-phone/repositories/person-phone-repository";
import { PERSON_ADDRESS_REPOSITORY } from "../../person-address/repositories/person-address-repository";
import { MANAGE_PERSON_PHONE } from "../../person-phone/services/manage-person-phone";
import { MANAGE_PERSON_ADDRESS } from "../../person-address/services/manage-person-address";

export const MANAGE_PERSON = {
  async list(em: EntityManager, filters: PersonFilter) {
    return await PERSON_REPOSITORY.list(em, filters);
  },

  async getById(em: EntityManager, personId: number) {
    const person = await PERSON_REPOSITORY.getByIdOrFail(em, personId);
    await em.populate(person, [
      "phones",
      "phones.person",
      "addresses",
      "addresses.person",
    ]);
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

  dtoToEntities(dto: PersonCreateRequest): {
    person: Person;
    phone: PersonPhone | null;
    address: PersonAddress | null;
  } {
    const { phoneNumber, address: addressValue, ...personData } = dto;

    const person = new Person();
    assignSafe(personData, person);

    let phone: PersonPhone | null = null;
    if (phoneNumber) {
      phone = new PersonPhone();
      assignSafe({ phoneNumber, preferred: true }, phone);
    }

    let address: PersonAddress | null = null;
    if (addressValue) {
      address = new PersonAddress();
      assignSafe({ address: addressValue, preferred: true }, address);
    }

    return { person, phone, address };
  },

  async create(
    em: EntityManager,
    personData: PersonCreateRequest,
    flush = true,
  ) {
    const { person, phone, address } = this.dtoToEntities(personData);

    const createdPerson = await PERSON_REPOSITORY.save(em, person);

    if (phone) {
      await PERSON_PHONE_REPOSITORY.save(em, phone, createdPerson);
    }
    if (address) {
      await PERSON_ADDRESS_REPOSITORY.save(em, address, createdPerson);
    }

    if (flush) {
      await em.flush();
    }

    await em.populate(createdPerson, [
      "phones",
      "phones.person",
      "addresses",
      "addresses.person",
    ]);

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
        await MANAGE_PERSON_PHONE.create(em, { personId, ...phoneData }, false);
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
        );
      }
    }

    em.persist(existingPerson);

    if (flush) {
      await em.flush();
    }

    await em.populate(existingPerson, [
      "phones",
      "phones.person",
      "addresses",
      "addresses.person",
    ]);

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
};
