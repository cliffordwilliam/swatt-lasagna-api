import { EntityManager } from "@mikro-orm/postgresql";
import { PersonAddress } from "../entities/person-address.entity";
import { Person } from "../../person/entities/person.entity";

export const PERSON_ADDRESS_REPOSITORY = {
  async save(em: EntityManager, address: PersonAddress, person: Person) {
    if (address.preferred) {
      await em.nativeUpdate(
        PersonAddress,
        {
          person: { personId: person.personId },
          preferred: true,
          ...(address.addressId && { addressId: { $ne: address.addressId } }),
        },
        { preferred: false },
      );
    }

    address.person = person;
    em.persist(address);

    return address;
  },
};
