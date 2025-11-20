import { EntityManager } from "@mikro-orm/postgresql";
import { PersonPhone } from "../entities/person-phone.entity";
import { Person } from "../../person/entities/person.entity";

export const PERSON_PHONE_REPOSITORY = {
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
