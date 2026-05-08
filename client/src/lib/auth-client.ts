import { createAuthClient } from "better-auth/react";
import { adminClient, anonymousClient } from "better-auth/client/plugins";
import { sentinelClient } from "@better-auth/infra/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  plugins: [adminClient(), anonymousClient(), sentinelClient()],
});

export const { signIn, signUp, useSession, signOut } = authClient;
