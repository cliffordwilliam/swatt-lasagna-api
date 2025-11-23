import { EntityManager } from "@mikro-orm/postgresql";
import { PersonPhone } from "../entities/person-phone.entity";
import { PERSON_PHONE_REPOSITORY } from "../repositories/person-phone-repository";
import {
  PersonPhoneCreateRequest,
  PersonPhoneUpdateRequest,
  PersonPhoneFilter,
} from "../schemas/person-phone";
import { assignSafe } from "../../common/utils/assign-safe";
import { PERSON_REPOSITORY } from "../../person/repositories/person-repository";
import { InvalidRequestParameterException } from "../../api/models/error";

export const MANAGE_PERSON_PHONE = {
  async list(em: EntityManager, filters: PersonPhoneFilter) {
    return await PERSON_PHONE_REPOSITORY.list(em, filters);
  },

  async getById(em: EntityManager, phoneId: number) {
    const phone = await PERSON_PHONE_REPOSITORY.getByIdOrFail(em, phoneId);
    return {
      ...phone,
      personId: phone.person.personId,
    };
  },

  async create(
    em: EntityManager,
    phoneData: PersonPhoneCreateRequest,
    flush = true,
  ) {
    const person = await PERSON_REPOSITORY.getByIdOrFail(
      em,
      phoneData.personId,
    );

    const phone = new PersonPhone();
    phone.phoneNumber = phoneData.phoneNumber;
    phone.preferred = phoneData.preferred;
    phone.person = person;

    await PERSON_PHONE_REPOSITORY.save(em, phone, person);

    if (flush) {
      await em.flush();
    }

    return {
      ...phone,
      personId: phone.person.personId,
    };
  },

  async update(
    em: EntityManager,
    phoneId: number,
    updates: PersonPhoneUpdateRequest,
    personId: number,
    flush = true,
  ) {
    const phone = await em.findOneOrFail(PersonPhone, {
      phoneId,
      person: { personId },
    });

    if (phone.preferred === true && updates.preferred === false) {
      throw new InvalidRequestParameterException(
        "Cannot set preferred to false. You can only toggle preferred from false to true.",
      );
    }

    assignSafe(updates, phone);

    await PERSON_PHONE_REPOSITORY.save(em, phone, phone.person);

    if (flush) {
      await em.flush();
    }

    return {
      ...phone,
      personId: phone.person.personId,
    };
  },
};
