import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import prisma from "./prisma";
import { config } from "../utils/app.config";
import { sendEmail } from "../mailers/mailer";
import {
  passwordResetTemplate,
  securityAlertTemplate,
} from "../mailers/templates/template";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: "http://localhost:3021",
  appName: "Vectyz",
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://v2.vectyz.com",
    "https://v2admin.vectyz.com",
  ],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      // Construct manual link to frontend to avoid middleware/redirect issues
      const resetLink = `${config.BETTER_AUTH_URL}/reset-password?token=${token}`;

      await sendEmail({
        to: user.email,
        ...passwordResetTemplate(resetLink),
      });
    },
    async onPasswordReset({ user }, request) {
      // 1. Send Security Alert Email
      await sendEmail({
        to: user.email,
        ...securityAlertTemplate(),
      });

      // 2. Log Audit Activity
      const ip =
        request?.headers?.get instanceof Function
          ? request.headers.get("x-forwarded-for")
          : "unknown";
      const userAgent =
        request?.headers?.get instanceof Function
          ? request.headers.get("user-agent")
          : "unknown";

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "PASSWORD_RESET_SUCCESS",
          ipAddress: (ip as string) || "unknown",
          userAgent: (userAgent as string) || "unknown",
          metadata: { timestamp: new Date() },
        },
      });

      // 3. Revoke other sessions
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
        },
      });
    },
  },
  socialProviders: {
    google: {
      clientId: config.GOOGLE_CLIENT_ID as string,
      clientSecret: config.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
        unique: true,
        input: true, // Set true agar bisa diinput saat signUp/update
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // Don't allow user to set role
      },
      banned: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      banReason: {
        type: "string",
        required: false,
        input: false,
      },
      banExpires: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },
  plugins: [admin()],
  advanced: {
    disableOriginCheck: config.NODE_ENV !== "production", // Fix issue Issue 403 MISSING_OR_NULL_ORIGIN
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      refreshCache: true,
      strategy: "jwt",
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // 2. Create Empty User Profile
          await prisma.userProfile.create({
            data: {
              userId: user.id,
            },
          });
        },
      },
    },
  },
});
