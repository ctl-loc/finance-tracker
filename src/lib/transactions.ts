import { TransactionClient } from "@/types/transaction";
import prisma from "./prisma";

export const getRecentTransactions = async (
  userId: string,
  amount?: number
) => {
  const trans = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: amount,
  });

  return trans;
};

export const addTransaction = async (transaction: TransactionClient) => {
  return await prisma.transaction.create({
    data: {
      ...transaction,
    },
  });
};
