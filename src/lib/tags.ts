import { Tag } from "@/generated/prisma";
import prisma from "./prisma";

export const getTags = async (userId: string) => {
  return prisma.tag.findMany({
    where: {
      userId: userId,
    },
  });
};

export const addTag = async (tag: Tag) => {
  return await prisma.tag.create({ data: { ...tag } });
};
