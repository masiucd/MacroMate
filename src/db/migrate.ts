import {migrate} from "drizzle-orm/postgres-js/migrator";

import env from "@/env";
import config from "$/drizzle.config";

import {connection, db} from ".";

if (!env.DB_MIGRATION) {
  throw new Error("DB_MIGRATION is not set");
}

(async function () {
  await migrate(db, {migrationsFolder: config.out!});
  await connection.end();
})();
