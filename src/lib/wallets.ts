import { BankAccount } from "@/generated/prisma";
import prisma from "./prisma";

export const addWallet = async (wallet: BankAccount) => {
  await prisma.bankAccount.create({
    data: {
      userId: wallet.userId,
      name: wallet.name,
      balance: wallet.balance,
    },
  });
};

export const getWallets = async (userId: string) => {
  return await prisma.bankAccount.findMany({
    where: {
      userId: userId,
    },
  });
};
