import { treaty } from "@elysia/eden";
import { describe, expect, it } from "vite-plus/test";

import { app } from "#src/app.ts";

const api = treaty(app);

describe("Health Service | Unit", () => {
  it("should return ok if db is up", async () => {
    const { data } = await api.health.get();
    expect(data).toBe("ok");
  });
});
