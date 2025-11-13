import { MikroORM } from "@mikro-orm/postgresql";
import { MIKRO_ORM_CONFIG } from "../config/mikro-orm.config";
import { ENV } from "../config/constants";
import logger from "../logging/logger";

let orm: MikroORM | null = null;

export async function getORM() {
  if (!orm) {
    try {
      orm = await MikroORM.init(MIKRO_ORM_CONFIG);
      if (ENV.NODE_ENV === "development") {
        await orm.getSchemaGenerator().updateSchema();
      }
    } catch (e) {
      logger.error({ err: e }, "Failed to connect to database");
      process.exit(1);
    }
  }
  return orm;
}

export async function getEM() {
  const o = await getORM();
  return o.em.fork();
}
