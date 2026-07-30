import prisma from "../lib/prisma";

export const getMySessionService = async (currentUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: currentUserId },
    include: {
      profile: true,
      sessions: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
