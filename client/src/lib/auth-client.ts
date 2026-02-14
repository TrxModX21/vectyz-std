import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3021", // URL Backend Express Anda
  plugins: [adminClient()],
});

export const { signIn, signUp, useSession, signOut } = authClient;
