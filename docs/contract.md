# Contract

What each layer must preserve. Implementation that satisfies the same contract may change freely.

# DB Schema

Tables are defined in `packages/db/src/schema/`; this section records the behavior the schema guarantees.

## `todos`

```ts
export const todos = snakeCase.table(
  "todos",
  {
    completed: integer({ mode: "boolean" }).notNull().default(false),
    createdAt: integer({ mode: "timestamp_ms" })
      .notNull()
      .default(sql`(cast(unixepoch('subsec') * 1000 as integer))`),
    id: integer().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
  },
  (table) => [
    check(
      "todos_title_length",
      sql`length(trim(${table.title})) between 1 and 100`
    ),
  ]
);
```

## Invariants

- `title` is non-empty after trimming and at most 100 characters (enforced by the `todos_title_length` CHECK).
- `completed` defaults to `false`.
- `created_at` is a millisecond Unix timestamp, defaulting to now.
- `id` is an auto-incrementing primary key.

# API

Every module mounts under a route prefix and a single OpenAPI tag, and every route's type is part of `App`.

## Health

- `GET /health` → `200` with body `"ok"`. Runs `select 1` against the database, so it reports `ok` only when the connection is alive.

# External Behavior

- **OpenAPI**: served at `GET /openapi`; the document is generated from the app's types.
- **CORS**: enabled with permissive defaults.
- **Logging**: request logging via the pino-backed Elysia logger, at `LOG_LEVEL`.
- **Home page**: `/` renders the stack summary and an API status badge that reflects the `/health` result.

## Configuration

Read from the environment in `apps/api/src/env.ts`, with the defaults below. See `apps/api/.env.example`.

| Variable       | Default       | Purpose          |
| -------------- | ------------- | ---------------- |
| `NODE_ENV`     | `development` | Runtime mode     |
| `LOG_LEVEL`    | `info`        | Pino log level   |
| `DATABASE_URL` | `local.db`    | SQLite file path |
| `PORT`         | `3000`        | API listen port  |

## Testing contract

- **API unit tests** import `app` from `src/app.ts` and call it through `treaty(app)` in-process; no server or socket is started.
- **Database tests** use `createTestDatabase()` from `@bstack/db/testing`, which returns a migrated database and a `remove()` cleanup.
- **E2E tests** start a web dev server on port `3200` (`E2E_TEST_PORT`) via Playwright global setup and drive it in a browser.
