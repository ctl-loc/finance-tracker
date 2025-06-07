import { BankAccount } from "@/generated/prisma";
import prisma from "./prisma";
import extendedPrisma from "./prisma";
import { addTransaction } from "./transactions";

interface CreateWalletParams {
  userId: string;
  name: string;
  balance: number;
}

// Create a new wallet with automatic history tracking
export const addWallet = async ({
  userId,
  name,
  balance,
}: {
  userId: string;
  name: string;
  balance: number;
}) => {
  // Create wallet with no balance
  const wallet = await prisma.bankAccount.create({
    data: {
      userId,
      name,
      balance: 0,
    },
  });

  // add balance via transaction
  addTransaction({
    userId,
    bankAccountId: wallet.id,
    amount: balance,
    description: "Initial balance",
    tags: [],
  });

  return wallet;
};

// Get wallet state at specific time
export const getHistoricalWallet = async (
  walletId: string,
  timestamp: Date
) => {
  const history = await prisma.bankAccountHistory.findFirst({
    where: {
      bankAccountId: walletId,
      validFrom: { lte: timestamp },
      validTo: { gt: timestamp },
    },
  });

  if (!history) return null;

  return {
    id: history.bankAccountId,
    userId: history.userId,
    name: history.name,
    balance: history.balance,
    validFrom: history.validFrom,
    validTo: history.validTo,
  };
};

// Get all wallets for user
export const getWallets = async (userId: string, walletId?: string) => {
  return await prisma.bankAccount.findMany({
    where: { userId: userId, id: walletId },
  });
};
