import prisma from "../lib/prisma";

export const followUserService = async (
  followerId: string,
  followingId: string
) => {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  // Check if already following
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existingFollow) {
    throw new Error("You are already following this user");
  }

  // Transaction: Create follow record and update counters
  await prisma.$transaction([
    prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    }),
    prisma.user.update({
      where: { id: followerId },
      data: { totalFollowing: { increment: 1 } },
    }),
    prisma.user.update({
      where: { id: followingId },
      data: { totalFollowers: { increment: 1 } },
    }),
  ]);

  return { followed: true };
};

export const unfollowUserService = async (
  followerId: string,
  followingId: string
) => {
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (!existingFollow) {
    throw new Error("You are not following this user");
  }

  // Transaction: Delete follow record and update counters
  await prisma.$transaction([
    prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    }),
    prisma.user.update({
      where: { id: followerId },
      data: { totalFollowing: { decrement: 1 } },
    }),
    prisma.user.update({
      where: { id: followingId },
      data: { totalFollowers: { decrement: 1 } },
    }),
  ]);

  return { followed: false };
};

export const checkFollowStatusService = async (
  followerId: string,
  followingId: string
) => {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  return { isFollowing: !!follow };
};

export const getUserFollowersService = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [followers, totalCount] = await Promise.all([
    prisma.follow.findMany({
      where: { followingId: userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            totalFollowers: true,
          },
        },
      },
    }),
    prisma.follow.count({ where: { followingId: userId } }),
  ]);

  return {
    followers: followers.map((f) => f.follower),
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
};

export const getUserFollowingService = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [following, totalCount] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            totalFollowers: true,
          },
        },
      },
    }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);

  return {
    following: following.map((f) => f.following),
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
};
