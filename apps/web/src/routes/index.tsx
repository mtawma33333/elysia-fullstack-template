import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@bstack/ui/components/card";

import { ApiStatus } from "#src/components/api-status.tsx";

const HomePage = () => (
  <Card>
    <CardHeader>
      <CardTitle>bstack</CardTitle>
      <CardDescription>
        React, Elysia, SQLite and Drizzle on Vite+.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex items-center justify-between">
      <span>API status</span>
      <ApiStatus />
    </CardContent>
  </Card>
);

export const Route = createFileRoute("/")({
  component: HomePage,
});
