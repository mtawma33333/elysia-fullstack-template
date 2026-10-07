import { useQuery } from "@tanstack/react-query";

import { Badge } from "@bstack/ui/components/badge";

import { app } from "#src/lib/api.ts";

export const ApiStatus = () => {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: async () => await app.health.get(),
  });

  if (health.isPending) {
    return <Badge variant="outline">Checking</Badge>;
  }

  return health.isSuccess ? (
    <Badge>Connected</Badge>
  ) : (
    <Badge variant="destructive">Disconnected</Badge>
  );
};
