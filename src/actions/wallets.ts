"use server";

import { BankAccount } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { addTransaction } from "./transactions";
import { ActionReturn } from "@/types/types";

/**
 * Adds a new wallet (bank account) to the database for a specified user.
 *
 * @param wallet - The bank account information to be added, including userId, name, and balance.
 * @returns An object containing the operation result:
 *   - If successful, returns `{ success: true, data: newWallet }` where `newWallet` is the created bank account.
 *   - If an error occurs, returns `{ success: false }`.
 */
export async function addWallet(
  wallet: BankAccount
): ActionReturn<BankAccount> {
  try {
    // initiate wallet at 0
    const newWallet = await prisma.bankAccount.create({
      data: {
        userId: wallet.userId,
        name: wallet.name,
        balance: 0,
      },
    });

    await addTransaction({
      userId: wallet.userId,
      bankAccountId: newWallet.id,
      amount: wallet.balance,
      description: "Init balance transaction",
      tags: [],
    });

    console.info(`[INFO] Wallet added for ${wallet.userId} : ${newWallet.id}`);
    return { success: true, data: newWallet };
  } catch (error) {
    console.error("[ERROR] adding new wallet : ", error);
    return { success: false };
  }
}

/**
 * Fetch wallets (bank account) from the database for a specified user.
 *
 * @param userId - The user the wallets will be fetch from
 *
 * @returns An object containing the operation result:
 *   - If successful, returns `{ success: true, data: wallets }` where `wallets` is a list containing .
 *   - If an error occurs, returns `{ success: false }`.
 *
 * @remark use getHistoryWallet for non-live information
 */
export async function getWallets(userId: string): ActionReturn<BankAccount[]> {
  try {
    const wallets = await prisma.bankAccount.findMany({
      where: { userId: userId },
    });

    return { success: true, data: wallets };
  } catch (error) {
    console.error("[ERROR] on wallets fetching : ", error);
    return { success: false };
  }
}

/**
 * Fetch wallet state at a specific time.
 *
 * @param userId - The user whose wallet will be fetched.
 * @param walletId - The requested wallet ID.
 * @param timestamp - The point in time for which to fetch the wallet state.
 *
 * @returns An object containing the operation result:
 *   - If successful, returns `{ success: true, data }` where `data` is the wallet state at the given time or `null` if not found.
 *   - If an error occurs, returns `{ success: false }`.
 */
export async function getHistoryWallet(
  userId: string,
  walletId: string,
  timestamp: Date
): ActionReturn<{
  id: string;
  userId: string;
  name: string;
  balance: number;
  validFrom: Date;
  validTo: Date;
} | null> {
  try {
    const history = await prisma.bankAccountHistory.findFirst({
      where: {
        userId: userId,
        bankAccountId: walletId,
        validFrom: { lte: timestamp },
        validTo: { gt: timestamp },
      },
    });

    if (!history)
      return {
        success: true,
        data: null,
      };

    return {
      success: true,
      data: {
        id: history.bankAccountId,
        userId: history.userId,
        name: history.name,
        balance: history.balance,
        validFrom: history.validFrom,
        validTo: history.validTo,
      },
    };
  } catch (error) {
    console.error("[ERROR] on wallet history fetching : ", error);
    return { success: false };
  }
}
