/* eslint-disable @typescript-eslint/no-explicit-any */
export type TransactionClient = {
  userId: string;
  amount: number;
  description: string;
  tags: string[];
  bankAccount?: any;
  createdAt?: any;
  updatedAt?: any;
  id?: string;
};
