import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [convexClient()],
});

export const signIn = async () => {
  await authClient.signIn.social({
    provider: "github",
  });
};

export const signOut = async () => {
  await authClient.signOut();
};
