import { createDb } from "@bstack/db";
import { migrateDatabase } from "@bstack/db/migrate";

import { env } from "#src/env.ts";

const db = createDb(env.DATABASE_URL);
migrateDatabase(db);
db.$client.close();
