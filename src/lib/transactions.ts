import { Tag } from "@/generated/prisma";
import prisma from "./prisma";

export const getRecentTransactions = async (userId: string) => {
  const trans = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });

  return trans;
};

export const addTransaction = async (transaction: {
  userId: string;
  bankAccountId: string;
  amount: number;
  description?: string | null;
  tags: Array<Tag>;
}) => {
  return await prisma.transaction.create({
    data: {
      userId: transaction.userId,
      bankAccountId: transaction.bankAccountId,
      amount: transaction.amount,
      description: transaction.description,
      tags: {
        connect: transaction.tags.map((tag: Tag) => ({
          id: tag.id,
        })),
      },
    },
  });
};
