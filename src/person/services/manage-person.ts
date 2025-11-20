import withTransaction from "../../common/utils/transactional";
import { Person } from "../entities/person.entity";
import { PERSON_REPOSITORY } from "../repositories/person-repository";
import { PersonCreateRequest } from "../schemas/person";
import { PersonPhone } from "../../person-phone/entities/person-phone.entity";
import { PersonAddress } from "../../person-address/entities/person-address.entity";
import { PERSON_PHONE_REPOSITORY } from "../../person-phone/repositories/person-phone-repository";
import { PERSON_ADDRESS_REPOSITORY } from "../../person-address/repositories/person-address-repository";

export const MANAGE_PERSON = {
  dtoToEntities(dto: PersonCreateRequest): {
    person: Person;
    phone: PersonPhone | null;
    address: PersonAddress | null;
  } {
    const person = new Person();
    person.personName = dto.personName;

    let phone: PersonPhone | null = null;
    if (dto.phoneNumber) {
      phone = new PersonPhone();
      phone.phoneNumber = dto.phoneNumber;
      phone.preferred = true;
    }

    let address: PersonAddress | null = null;
    if (dto.address) {
      address = new PersonAddress();
      address.address = dto.address;
      address.preferred = true;
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

      const personWithRelations = await em.findOneOrFail(
        Person,
        { personId: createdPerson.personId },
        { populate: ["phones", "addresses"] },
      );

      return {
        ...personWithRelations,
        phones: Array.from(personWithRelations.phones),
        addresses: Array.from(personWithRelations.addresses),
      };
    });
  },
};
