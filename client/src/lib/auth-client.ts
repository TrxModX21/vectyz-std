import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // URL Backend Express Anda
  plugins: [adminClient()],
});

export const { signIn, signUp, useSession, signOut } = authClient;
