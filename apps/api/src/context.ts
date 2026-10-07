import { createDb } from "@bstack/db";

import { env } from "#src/env.ts";

export const db = createDb(env.DATABASE_URL);
