import { Elysia } from "elysia";

import type { DatabaseContext } from "#src/context.ts";

import { createHealthRoutes } from "./health";

export const createApi = (databaseContext: DatabaseContext) =>
  new Elysia({
    prefix: "/api",
  }).use(createHealthRoutes(databaseContext));
