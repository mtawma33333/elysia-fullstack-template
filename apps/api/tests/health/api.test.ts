import { treaty } from "@elysia/eden";
import { afterAll, describe, expect, it } from "vite-plus/test";

import { createTestDatabase } from "@bstack/db/testing";

import { createApp } from "#src/app.ts";
import { createDatabaseContext } from "#src/context.ts";

const testDatabase = await createTestDatabase();
const Api = treaty(createApp(createDatabaseContext(testDatabase.db))).api;

describe("Health Service | Unit", () => {
  afterAll(async () => {
    await testDatabase.remove();
  });

  it("should return ok if db is up", async () => {
    const { data } = await Api.health.get();
    expect(data).toBe("ok");
  });
});
