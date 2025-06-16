"use server";

import { Tag } from "@/generated/prisma";
import extendedPrisma from "@/lib/prisma";
import { ActionReturn, TransactionWithTags } from "@/types/types";

/**
 * Retrieves a list of transactions for a specific user, optionally filtered by wallet and time limit.
 *
 * @param userId - The unique identifier of the user whose transactions are to be fetched.
 * @param walletId - (Optional) The unique identifier of the wallet to filter transactions. If not provided, transactions from all wallets are included.
 * @param timeLimit - (Optional) A Date object representing the lower bound for the transaction creation date. Only transactions created on or after this date are returned.
 *
 * @returns An object containing the operation result:
 *   - If successful, returns `{ success: true, data: TransactionWithTags }` where `data` is an array of transactions.
 *   - If an error occurs, returns `{ success: false }`.
 * */
export async function getTransactions(
  userId: string,
  walletId: string | undefined,
  timeLimit?: { from: Date; to?: Date }
): ActionReturn<TransactionWithTags[]> {
  // create where field for request
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const where: any = { userId };
  if (walletId) where.id = walletId;
  if (timeLimit) {
    where.createdAt = {
      gte: timeLimit.from,
      ...(timeLimit.to && { lte: timeLimit.to }),
    };
  }

  try {
    const trans: TransactionWithTags[] =
      await extendedPrisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { tags: true },
      });

    return { success: true, data: trans };
  } catch (error) {
    console.error("[ERROR] fetching transactions : ", error);
    return { success: false };
  }
}

/**
 * Adds a new transaction for a specific user, associates it with a bank account, updates the account balance,
 * and links any provided tags to the transaction.
 *
 * @param transaction - An object containing the transaction details:
 *   - userId: The unique identifier of the user creating the transaction.
 *   - bankAccountId: The unique identifier of the bank account associated with the transaction.
 *   - amount: The amount of the transaction.
 *   - description: (Optional) A description for the transaction.
 *   - tags: An array of Tag objects to associate with the transaction.
 *
 * @returns An object containing the operation result:
 *   - If successful, returns `{ success: true, data: TransactionWithTags }` where `data` is the newly created transaction with its tags.
 *   - If an error occurs, returns `{ success: false }`.
 */

export async function addTransaction(transaction: {
  userId: string;
  bankAccountId: string;
  amount: number;
  description?: string | null;
  tags: Array<Tag>;
}): ActionReturn<TransactionWithTags> {
  try {
    const addedTrans = await extendedPrisma.transaction.create({
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
    await extendedPrisma.bankAccount.update({
      where: { id: transaction.bankAccountId },
      data: { balance: { increment: transaction.amount } },
    });

    // add tags to new transaction for return
    const safeTransaction: TransactionWithTags = {
      ...addedTrans,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tags: (transaction as any).tags ?? [],
    };
    return { success: true, data: safeTransaction };
  } catch (error) {
    console.error("[ERROR] adding new transaction : ", error);
    return { success: false };
  }
}
