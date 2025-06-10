"use client";
import { Tag } from "@/generated/prisma";
import React, { startTransition, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TransactionWithTags } from "@/types/types";
import { useSession } from "next-auth/react";
import { getTransactions } from "@/actions/transactions";

export function TransactionsTable({ amount }: { amount: number | undefined }) {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState([] as TransactionWithTags[]);

  useEffect(
    () =>
      startTransition(async () => {
        if (status !== "authenticated") return;
        const { success, data } = await getTransactions(
          session.user.id,
          undefined
        );
        console.log(data);
        if (success && data) setTransactions(data);
      }),
    [session, status]
  );

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
          .map((transaction) => {
            // Ensure tags property exists
            const safeTransaction: TransactionWithTags = {
              ...transaction,
              /* eslint-disable @typescript-eslint/no-explicit-any */
              tags: (transaction as any).tags ?? [],
            };
            return (
              <TableRow key={safeTransaction.id}>
                <TableCell className="font-medium">
                  {new Date(safeTransaction.createdAt).toLocaleDateString(
                    "fr-FR"
                  )}
                </TableCell>
                <TableCell
                  className={
                    safeTransaction.amount >= 0
                      ? "text-green-700 "
                      : "text-red-700"
                  }
                >
                  €{safeTransaction.amount}
                </TableCell>
                <TableCell>{safeTransaction.bankAccountId}</TableCell>
                <TableCell>{safeTransaction.description}</TableCell>
                <TableCell className="text-right">
                  {safeTransaction.tags.map((tag: Tag) => tag.name).join(", ")}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
