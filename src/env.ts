import {config} from "dotenv";
import {expand} from "dotenv-expand";
import {z, ZodError} from "zod";

let stringBool = z.coerce
  .string()
  .transform((val) => (val === "true" ? true : val))
  .default("false");

let envSchema = z.object({
  DB_PASSWORD: z.string(),
  DB_URL: z.string(),
  DB_USER: z.string(),
  DB_NAME: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_MIGRATION: stringBool,
  DB_SEED: stringBool,
  NODE_ENV: z.string().default("development"),
  REDIS_PORT: z.string(),
});

export type Env = z.infer<typeof envSchema>;
expand(config()); // Load .env file

try {
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = "Invalid env file:";
    for (let issue of error.issues) {
      message += `\n - ${issue.message}`;
    }
    // eslint-disable-next-line no-console
    console.error(message);
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export default envSchema.parse(process.env);
