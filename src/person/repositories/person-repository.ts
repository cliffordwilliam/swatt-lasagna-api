import { EntityManager } from "@mikro-orm/postgresql";
import { Person } from "../entities/person.entity";

export const PERSON_REPOSITORY = {
  async save(em: EntityManager, person: Person) {
    await em.persistAndFlush(person);
    return person;
  },
};
