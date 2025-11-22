import { assignSafe } from "../../common/utils/assign-safe";
import withTransaction from "../../common/utils/transactional";
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

export const MANAGE_PERSON = {
  async list(filters: PersonFilter) {
    return withTransaction(async (em) => {
      return await PERSON_REPOSITORY.list(em, filters);
    });
  },

  async getById(personId: number) {
    return withTransaction(async (em) => {
      const person = await PERSON_REPOSITORY.getByIdOrFail(em, personId);
      await em.populate(person, ["phones", "addresses"]);
      return {
        ...person,
        phones: Array.from(person.phones),
        addresses: Array.from(person.addresses),
      };
    });
  },

  dtoToEntities(dto: PersonCreateRequest): {
    person: Person;
    phone: PersonPhone | null;
    address: PersonAddress | null;
  } {
    const person = new Person();
    const { phoneNumber, address: addressValue, ...personData } = dto;
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

  async create(personData: PersonCreateRequest) {
    return withTransaction(async (em) => {
      const { person, phone, address } = this.dtoToEntities(personData);

      const createdPerson = await PERSON_REPOSITORY.save(em, person);

      if (phone) {
        await PERSON_PHONE_REPOSITORY.save(em, phone, createdPerson);
      }
      if (address) {
        await PERSON_ADDRESS_REPOSITORY.save(em, address, createdPerson);
      }

      await em.flush();

      return {
        ...createdPerson,
        phones: Array.from(createdPerson.phones),
        addresses: Array.from(createdPerson.addresses),
      };
    });
  },

  async update(updates: PersonUpdateRequest, personId: number) {
    return withTransaction(async (em) => {
      const existingPerson = await PERSON_REPOSITORY.getByIdOrFail(
        em,
        personId,
      );

      assignSafe(updates, existingPerson);

      if (updates.phone !== undefined) {
        let phone: PersonPhone;
        const { phoneId, ...phoneData } = updates.phone;
        if (phoneId !== undefined) {
          phone = await em.findOneOrFail(PersonPhone, {
            phoneId,
            person: { personId },
          });
          assignSafe(phoneData, phone);
        } else {
          phone = new PersonPhone();
          assignSafe(phoneData, phone);
        }
        await PERSON_PHONE_REPOSITORY.save(em, phone, existingPerson);
      }

      if (updates.address !== undefined) {
        let address: PersonAddress;
        const { addressId, ...addressData } = updates.address;
        if (addressId !== undefined) {
          address = await em.findOneOrFail(PersonAddress, {
            addressId,
            person: { personId },
          });
          assignSafe(addressData, address);
        } else {
          address = new PersonAddress();
          assignSafe(addressData, address);
        }
        await PERSON_ADDRESS_REPOSITORY.save(em, address, existingPerson);
      }

      em.persist(existingPerson);
      await em.flush();

      await em.populate(existingPerson, ["phones", "addresses"]);

      return {
        ...existingPerson,
        phones: Array.from(existingPerson.phones),
        addresses: Array.from(existingPerson.addresses),
      };
    });
  },
};
