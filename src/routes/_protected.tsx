import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useEffect } from "react";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
  beforeLoad: async (opts) => {
    const user = await opts.context.queryClient.ensureQueryData(
      convexQuery(api.auth.getUser, {}),
    );

    return { user };
  },
  loader: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  const { data: user } = useSuspenseQuery(convexQuery(api.auth.getUser, {}));

  useEffect(() => {
    if (!user) {
      navigate({ to: "/" });
    }
  }, [user]);

  return <Outlet />;
}
