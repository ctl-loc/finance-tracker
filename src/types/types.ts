import { Tag, Transaction } from "@/generated/prisma";

export type TransactionWithTags = Transaction & {
  tags: Tag[];
};

export type ActionReturn<T> = Promise<{ success: boolean; data?: T }>;
