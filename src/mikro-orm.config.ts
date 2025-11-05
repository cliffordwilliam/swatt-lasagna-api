import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";

const config: Options = {
  driver: PostgreSqlDriver,
  host: "localhost",
  port: 5432,
  user: "postgres",
  dbName: "be_waffle_shop",
  password: "postgres",
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
};
export default config;
