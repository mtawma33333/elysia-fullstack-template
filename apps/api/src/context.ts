import { Elysia } from "elysia";

import type { Database } from "@bstack/db";

/**
 * Wraps a database in an Elysia plugin that decorates it as `db` on the request
 * context.
 *
 * Nothing imports a database at module scope, so the composition root chooses the
 * connection: the server passes `createDb(env.DATABASE_URL)`, tests pass
 * `createTestDatabase().db`. Handlers read `db` from `Context` after their module
 * calls `.use(databaseContext)`.
 */
export const createDatabaseContext = (db: Database) =>
  new Elysia({ name: "database" }).decorate("db", db);

export type DatabaseContext = ReturnType<typeof createDatabaseContext>;
