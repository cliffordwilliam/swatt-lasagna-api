import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.string(),
  PORT: z.coerce.number(),
});

function getEnv() {
  try {
    return EnvSchema.parse(process.env);
  } catch {
    process.exit(1);
  }
}

export const env = getEnv();
