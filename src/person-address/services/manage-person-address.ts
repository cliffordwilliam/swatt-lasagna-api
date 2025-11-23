import { EntityManager } from "@mikro-orm/postgresql";
import { PersonAddress } from "../entities/person-address.entity";
import { PERSON_ADDRESS_REPOSITORY } from "../repositories/person-address-repository";
import {
  PersonAddressCreateRequest,
  PersonAddressUpdateRequest,
  PersonAddressFilter,
} from "../schemas/person-address";
import { assignSafe } from "../../common/utils/assign-safe";
import { PERSON_REPOSITORY } from "../../person/repositories/person-repository";
import { InvalidRequestParameterException } from "../../api/models/error";

export const MANAGE_PERSON_ADDRESS = {
  async list(em: EntityManager, filters: PersonAddressFilter) {
    return await PERSON_ADDRESS_REPOSITORY.list(em, filters);
  },

  async getById(em: EntityManager, addressId: number) {
    const address = await PERSON_ADDRESS_REPOSITORY.getByIdOrFail(
      em,
      addressId,
    );
    return {
      ...address,
      personId: address.person.personId,
    };
  },

  async create(
    em: EntityManager,
    addressData: PersonAddressCreateRequest,
    flush = true,
  ) {
    const person = await PERSON_REPOSITORY.getByIdOrFail(
      em,
      addressData.personId,
    );

    const address = new PersonAddress();
    address.address = addressData.address;
    address.preferred = addressData.preferred;
    address.person = person;

    await PERSON_ADDRESS_REPOSITORY.save(em, address, person);

    if (flush) {
      await em.flush();
    }

    return {
      ...address,
      personId: address.person.personId,
    };
  },

  async update(
    em: EntityManager,
    addressId: number,
    updates: PersonAddressUpdateRequest,
    personId: number,
    flush = true,
  ) {
    const address = await em.findOneOrFail(PersonAddress, {
      addressId,
      person: { personId },
    });

    if (address.preferred === true && updates.preferred === false) {
      throw new InvalidRequestParameterException(
        "Cannot set preferred to false. You can only toggle preferred from false to true.",
      );
    }

    assignSafe(updates, address);

    await PERSON_ADDRESS_REPOSITORY.save(em, address, address.person);

    if (flush) {
      await em.flush();
    }

    return {
      ...address,
      personId: address.person.personId,
    };
  },
};
