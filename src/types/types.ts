import { Tag, Transaction } from "@/generated/prisma";

export type TransactionWithTags = Transaction & {
  tags: Tag[];
};
