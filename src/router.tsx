import * as Sentry from "@sentry/tanstackstart-react";
import { createRouter } from "@tanstack/react-router";
import { MutationCache, QueryClient } from "@tanstack/react-query";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";

import { routeTree } from "./routeTree.gen";
import { env } from "./env";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

export function getRouter() {
  const CONVEX_URL = env.VITE_CONVEX_URL;

  const convex = new ConvexReactClient(CONVEX_URL, {
    unsavedChangesWarning: false,
  });
  const convexQueryClient = new ConvexQueryClient(convex);

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
    mutationCache: new MutationCache({
      onError: (error) => {
        const errorMessage =
          error instanceof ConvexError
            ? (error.data as { message: string }).message
            : "Unexpected error occurred";

        if (error.message) {
          toast.error(errorMessage);
        }
      },
    }),
  });
  convexQueryClient.connect(queryClient);

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      defaultPreload: "intent",
      context: { queryClient, convexClient: convex, convexQueryClient },
      scrollRestoration: true,
      Wrap: ({ children }) => (
        <ConvexProvider client={convexQueryClient.convexClient}>
          {children}
        </ConvexProvider>
      ),
    }),
    queryClient,
  );

  if (!router.isServer) {
    Sentry.init({
      dsn: "https://2139e36f2d18275aa96d6fc47f66dd0f@o4510381361332224.ingest.us.sentry.io/4510381362642944",
      // Adds request headers and IP for users, for more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
      sendDefaultPii: true,
      integrations: [],
    });
  }

  return router;
}
