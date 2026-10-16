import { sql } from "drizzle-orm";
import { Elysia, t } from "elysia";

import type { DatabaseContext } from "#src/context.ts";

const ROUTE_PREFIX = "/health";

export const createHealthRoutes = (databaseContext: DatabaseContext) =>
  new Elysia({
    tags: ["Health"],
    prefix: ROUTE_PREFIX,
  })
    .use(databaseContext)
    .get(
      "/",
      ({ db }) => {
        db.run(sql`select 1`);
        return "ok";
      },
      {
        response: t.String(),
      }
    );
