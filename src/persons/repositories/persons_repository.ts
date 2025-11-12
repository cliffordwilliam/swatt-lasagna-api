import { getEM } from "../../core/database/adapter";
import { PersonEntity } from "../entities/persons.entity";

export const PersonRepository = {
  async get_by_id_or_fail(id: number) {
    const em = await getEM();
    return em.findOneOrFail(PersonEntity, { id });
  },
  async save(person: PersonEntity) {
    const em = await getEM();
    await em.persistAndFlush(person);
    return person;
  },
  async list() {
    const em = await getEM();
    const persons = await em.findAll(PersonEntity);
    return {
      data: persons,
      pagination: {},
    };
  },
};
