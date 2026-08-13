import { Prisma } from "@/generated/prisma/client";

export type FileTypeData = Prisma.FileTypeGetPayload<{
  include: {
    _count: {
      select: {
        stocks: true;
      };
    };
  };
}>;
