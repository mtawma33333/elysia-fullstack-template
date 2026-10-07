# bstack

React, on [Vite+](https://viteplus.dev).

| Layer     | Choice                                                    |
| --------- | --------------------------------------------------------- |
| Frontend  | React 19, TanStack Router, TanStack Query, Tailwind CSS 4 |
| UI        | shadcn/ui on Base UI, in `packages/ui`                    |
| Toolchain | Vite+ (`vp`): dev, build, test, lint, format, type check  |

## Getting started

```sh
vp install
vp run dev
```

Open http://localhost:5173.

## Commands

```sh
vp check          # format, lint, type check
vp run knip       # unused files, exports, dependencies, and catalog entries
vp test           # unit tests (Vitest)
vp run test:e2e   # e2e tests (Playwright) in Chromium, against the dev server
vp run ready      # check + knip + test + test:e2e + production build
```

The first `vp run test:e2e` needs a browser: `cd apps/web && vp exec playwright install chromium`.
