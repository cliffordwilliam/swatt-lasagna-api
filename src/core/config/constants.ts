import dotenv from "dotenv";
import { z } from "zod";
import logger from "../logging/logger";

dotenv.config();

const ENV_SCHEMA = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.string(),
  PORT: z.coerce.number(),
});

function getEnv() {
  try {
    return ENV_SCHEMA.parse(process.env);
  } catch (e) {
    logger.error({ err: e }, "Invalid .env shape");
    process.exit(1);
  }
}

export const ENV = getEnv();
