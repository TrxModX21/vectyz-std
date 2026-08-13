import { Prisma } from "@/generated/prisma/client";

export type MySessionsData = Prisma.UserGetPayload<{
  include: { profile: true; sessions: true };
}>;