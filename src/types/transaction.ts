import { Transaction } from "@/generated/prisma";

// Replace 'YourType' with the actual type and 'keyToOmit' with the property you want to omit
export type TransactionClient = Omit<
  Transaction,
  "id" | "createdAt" | "updatedAt"
>;
