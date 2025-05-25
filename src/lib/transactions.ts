import prisma from "./prisma";
import { TransactionClient } from "@/types/transaction";

export const getRecentTransactions = async (userId: string) => {
  const trans = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
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
