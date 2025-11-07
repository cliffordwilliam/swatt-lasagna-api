import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { env } from "./constants";

export const config: Options = {
  driver: PostgreSqlDriver,
  clientUrl: env.DATABASE_URL,
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
};
