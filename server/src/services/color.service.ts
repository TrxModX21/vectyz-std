import prisma from "../lib/prisma";
import { ConflictException, NotFoundException } from "../utils/app-error";
import { generateSlugFromName } from "../utils/helper";

export const allColorService = async () => {
  const [colors, totalCount] = await Promise.all([
    prisma.color.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.color.count(),
  ]);

  return { colors, totalCount };
};

export const createColorService = async (body: any) => {
  const { name, color } = body;

  const slug = generateSlugFromName(name);

  // Check duplicate slug
  const existingSlug = await prisma.color.findUnique({ where: { slug } });
  if (existingSlug) {
    throw new ConflictException("Color name already exists");
  }

  const newColor = await prisma.color.create({
    data: { name, slug, color },
  });

  return newColor;
};

export const updateColorService = async (id: string, body: any) => {
  const { name, color } = body;

  const existingColor = await prisma.color.findUnique({ where: { id } });
  if (!existingColor) {
    throw new NotFoundException("Color not found");
  }

  let slug = existingColor.slug;

  if (name && name !== existingColor.name) {
    slug = generateSlugFromName(name);
    const checkSlug = await prisma.color.findUnique({ where: { slug } });
    if (checkSlug && checkSlug.id !== id) {
      throw new ConflictException("Color name already exists");
    }
  }

  const updatedColor = await prisma.color.update({
    where: { id },
    data: { name, slug, color },
  });

  return updatedColor;
};

export const deleteColorService = async (id: string) => {
  const existingColor = await prisma.color.findUnique({ where: { id } });
  if (!existingColor) {
    throw new NotFoundException("Color not found");
  }

  await prisma.color.delete({ where: { id } });
  return true;
};
