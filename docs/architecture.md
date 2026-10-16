# Architecture

The repository is a layered monorepo: web UI, API, and database. Each workspace package owns one layer and exposes a narrow entrypoint, so the implementation reads through package boundaries rather than through large explanatory docs.

## Module map

### `apps/web` — React frontend (`@bstack/web`)

In scope: routes, route-level data fetching, app-specific components, theme, and the API client.
Out of scope: business rules, persistence, and anything the API must own.

- `src/routes/`: file-based routes (TanStack Router). `src/routeTree.gen.ts` is generated.
- `src/components/`: components specific to this app. Shared primitives live in `packages/ui`.
- `src/lib/api.ts`: Eden Treaty client, typed by the API's exported `App` type.
- `src/lib/query-client.ts`: TanStack Query client with global error toasts.
- `src/router.tsx`: router construction; `src/main.tsx`: mount.

### `apps/api` — Elysia backend (`@bstack/api`)

In scope: HTTP routing, request validation, and translation between HTTP and the database.
Out of scope: UI concerns and SQL schema definitions (owned by `packages/db`).

- `src/index.ts`: builds the production app from the `DATABASE_URL` database, starts the server, handles shutdown, exports the `App` type.
- `src/app.ts`: `createApp(databaseContext)` builds the Elysia app; plugins (logger, CORS, OpenAPI) and feature routes register here.
- `src/context.ts`: `createDatabaseContext(db)`, an Elysia plugin that decorates `db` on the request context.
- `src/env.ts`: environment variables with defaults.
- `src/<module>/`: one directory per feature; each exports a `create<Feature>Routes(databaseContext)` factory. `health/` is the reference module.
- `tests/`: unit tests that build the app around a `createTestDatabase()` connection.

### `packages/db` — database (`@bstack/db`)

In scope: the SQLite connection factory, table definitions, relations, and migrations.
Out of scope: query logic and any HTTP concern.

- `src/index.ts`: `createDb(path)`, sets WAL, exports the `Database` type.
- `src/schema/`: one file per table with its constraints.
- `src/relations.ts`: `defineRelations`; update when a table is added or removed.
- `src/migrate.ts`: applies migrations; do not edit by hand.
- `src/migrations/`: generated SQL and snapshots; do not edit by hand.
- `src/testing.ts`: `createTestDatabase()`, a migrated throwaway database.

### `packages/ui` — shadcn components and global CSS (`@bstack/ui`)

In scope: shadcn/ui primitives (on Base UI) and the Tailwind theme.
Out of scope: app-specific composition; keep feature components in `apps/web`.

- `src/components/`: generated shadcn primitives. Treated as vendored; excluded from lint and fmt.
- `src/styles/globals.css`: Tailwind v4 theme and design tokens.
- `src/lib/utils.ts`: `cn` helper.

### `packages/config` — shared tsconfig (`@bstack/config`)

- `typescript/base.json`, `node.json`, `react.json`: the tsconfig bases every package extends.

## Invariants

1. **The web app depends on the API for types only.** `@bstack/api` is a devDependency of `apps/web`; the browser bundle never imports API code. The type flows from `export type App` in `apps/api/src/index.ts` into `treaty<App>`.
2. **Each API feature registers itself in `src/app.ts`.** A module exports a `create<Feature>Routes(databaseContext)` factory returning an Elysia instance with a `prefix` and an OpenAPI `tags` entry; `app.ts` composes modules, it does not hold route logic.
3. **All SQLite access goes through `packages/db`, and the connection is injected.** `apps/api` is the only app that builds one; `createDatabaseContext(db)` decorates it so handlers read `db` from `Context` instead of importing a singleton. The composition root decides the connection: the server injects `createDb(env.DATABASE_URL)`, tests inject `createTestDatabase().db`.
4. **Schema changes are generated, never written.** Edit `src/schema/`, then run `vp run db:generate` and `vp run db:migrate`. Treat `src/migrations/` as read-only.
5. **Intra-package imports use `#src/*`.** Cross-package imports use the `@bstack/*` package name, sorted into their own import group.
6. **Shared primitives live in `packages/ui`.** Add or update them there so every app sees the change.

## Data flow

```
browser (apps/web)
  └─ Eden Treaty client (src/lib/api.ts), typed by App
       └─ HTTP → Elysia app (apps/api)
            └─ route handler → Drizzle → packages/db → SQLite
```

- **Request path**: a route's TanStack Query against the Treaty client sends HTTP to the API; the module handler queries through Drizzle and returns data.
- **Type path**: the API is the single source of the request/response contract; the web client re-derives its types from `App` at build time.
- **Connection path**: the composition root wraps one `db` in `createDatabaseContext(db)` and decorates it onto the app, so every handler shares that single connection.

### Same-origin assumption

The web client targets `window.location.origin`, and no dev proxy is configured in `apps/web/vite.config.ts`. The client therefore reaches the API only when web and API share an origin. To run them on separate dev origins, add a proxy or point the Treaty base URL at the API.

## Toolchain

Vite+ (`vp`) drives dev, build, test, lint, format, and type check. The repository-root `vite.config.ts` owns the shared fmt/lint/test configuration; per-app `vite.config.ts` files add frontend plugins only. Codegen outputs (`routeTree.gen.ts`, `packages/db/src/migrations/**`) and vendored shadcn components are excluded from lint and format.
