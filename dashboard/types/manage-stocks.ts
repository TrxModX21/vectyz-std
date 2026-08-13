import { Prisma } from "@/generated/prisma/client";

export type StockData = Prisma.StockGetPayload<{
  include: {
    category: {
      select: { id: true; name: true };
    };
    fileType: {
      select: { id: true; name: true };
    };
    user: {
      select: { id: true; name: true; email: true; image: true };
    };
    files: true;
  };
}>;
