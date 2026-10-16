# AGENTS.md

Guidance for agents working in this monorepo.

## Project scope

This repo builds a **full-stack Web App** that `placeholder:purpose`

Modules:

- `apps/web/`: React frontend
- `apps/api/`: Elysia backend
- `packages/db/`: database
- `packages/ui/`: shadcn components & global CSS
- `packages/config/`: shared tsconfig
- `docs/`: contract, architecture

## Tech stack

- Language: TypeScript
- Frontend: React 19, TanStack Router, TanStack Query
- Backend: ElysiaJS
- DB: SQLite, Drizzle ORM v1
- UI: shadcn, base-ui, lucide icons, Tailwind CSS 4

## Toolchain (Vite+)

- use `vp install`, `vp check --fix`, not package manager
- use `vp run <script>`, not package manager

## Coding expectations

- prefer explicit, readable code over clever code
- use descriptive names
- use early returns to keep control flow simple
- avoid dead code and generic boilerplate comments

## Preferred workflow

1. read the relevant docs first
2. inspect the existing implementation
3. make the smallest coherent change
4. if change db schema, run `vp run db:migrate`
5. run `vp run ready`
6. update docs
