import { Tag } from "@/generated/prisma";
import prisma from "./prisma";

export const getRecentTransactions = async (
  userId: string,
  walletId: string | undefined,
  timeLimit?: Date // Use Date for time limit
) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const where: any = { userId };
  if (walletId) where.id = walletId;
  if (timeLimit) where.createdAt = { gte: timeLimit };

  const trans = await prisma.transaction.findMany({
    where,
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
  const addedTrans = await prisma.transaction.create({
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

  // update the bank account balance
  await prisma.bankAccount.update({
    where: { id: transaction.bankAccountId },
    data: { balance: { increment: transaction.amount } },
  });

  return addedTrans;
};
