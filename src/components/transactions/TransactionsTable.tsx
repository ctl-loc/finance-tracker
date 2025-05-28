"use client";
import { Tag } from "@/generated/prisma";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import useTransactions from "@/hooks/transactions";
import { TransactionWithTags } from "@/types/types";

export function TransactionsTable({ amount }: { amount: number | undefined }) {
  const { transactions } = useTransactions();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Tags</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions
          .slice(0, amount) // if amount is undefined, take the whole array
          .map((transaction: TransactionWithTags) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {new Date(transaction.createdAt).toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell
                className={
                  transaction.amount >= 0 ? "text-green-700 " : "text-red-700"
                }
              >
                €{transaction.amount}
              </TableCell>
              <TableCell>{transaction.bankAccountId}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="text-right">
                {transaction.tags.map((tag: Tag) => tag.name).join(", ")}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
