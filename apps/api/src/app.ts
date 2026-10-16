import { logger } from "@bogeychan/elysia-logger";
import { cors } from "@elysia/cors";
import { openapi, fromTypes } from "@elysia/openapi";
import { Elysia } from "elysia";

import { env } from "#src/env.ts";

import packageJson from "../package.json";
import { createApi } from "./api";
import type { DatabaseContext } from "./context.ts";

export const createApp = (databaseContext: DatabaseContext) =>
  new Elysia()
    .use(
      logger({
        level: env.LOG_LEVEL,
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      })
    )
    .use(cors())
    .use(
      openapi({
        documentation: {
          info: {
            title: "Elysia API",
            version: packageJson.version,
            description: "A Elysia OpenAPI documentation",
          },
        },
        references: fromTypes(),
      })
    )
    .use(createApi(databaseContext));
