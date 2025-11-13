import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { ENV } from "./constants";

export const MIKRO_ORM_CONFIG: Options = {
  driver: PostgreSqlDriver,
  clientUrl: ENV.DATABASE_URL,
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
};
