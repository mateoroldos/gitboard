import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
  dsn: "https://2139e36f2d18275aa96d6fc47f66dd0f@o4510381361332224.ingest.us.sentry.io/4510381362642944",
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
