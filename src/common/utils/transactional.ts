import { EntityManager } from "@mikro-orm/postgresql";
import { getORM } from "../../core/database/adapter";

export default async function withTransaction<T>(
  fn: (em: EntityManager) => Promise<T>,
): Promise<T> {
  const orm = await getORM();
  const em = orm.em.fork();
  await em.begin();
  try {
    const result = await fn(em);
    await em.commit();
    return result;
  } catch (error) {
    await em.rollback();
    throw error;
  }
}
