import { createAuthClient } from "better-auth/vue";
import { magicLinkClient, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [magicLinkClient(), adminClient()],
});

// Export specific methods for convenience
export const { signIn, signUp, signOut, useSession, magicLink } = authClient;
