import { EntityManager } from "@mikro-orm/postgresql";
import { getEM } from "../../core/database/adapter";

export default async function withTransaction<T>(
  fn: (em: EntityManager) => Promise<T>,
): Promise<T> {
  const em = await getEM();
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
