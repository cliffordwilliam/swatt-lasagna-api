import { MikroORM } from "@mikro-orm/postgresql";
import { config } from "../config/mikro-orm.config";

let orm: MikroORM | null = null;

export async function getORM() {
  if (!orm) {
    try {
      orm = await MikroORM.init(config);
      orm.getSchemaGenerator().updateSchema(); // Only in dev
    } catch {
      process.exit(1);
    }
  }
  return orm;
}

export async function getEM() {
  const o = await getORM();
  return o.em.fork();
}
