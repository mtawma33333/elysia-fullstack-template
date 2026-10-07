import { treaty } from "@elysia/eden";

import type { App } from "@bstack/api";

export const app = treaty<App>(
  window.location.origin ?? "http://localhost:3000",
  {}
);
