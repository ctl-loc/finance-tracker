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
import { getWallets } from "@/actions/wallets";
import { tr } from "date-fns/locale";

type TransactionWithTagsAndName = TransactionWithTags & { walletName: string };

export function TransactionsTable({ amount }: { amount: number | undefined }) {
    const { data: session, status } = useSession();
    const [transactions, setTransactions] = useState(
        [] as TransactionWithTagsAndName[]
    );

    // fetch transactions on load
    useEffect(
        () =>
            startTransition(async () => {
                if (status !== "authenticated") return;
                const { success, data } = await getTransactions(
                    session.user.id,
                    undefined
                );
                if (!success || !data) return;

                // add wallet name to the transaction
                const enriched = await Promise.all(
                    data.map(async (transaction) => {
                        // Ensure tags property exists
                        const safeTransaction: TransactionWithTags = {
                            ...transaction,
                            tags: (transaction as any).tags ?? [],
                        };

                        let walletName = "unknown";
                        if (safeTransaction.bankAccountId) {
                            const walletInfo = await getWallets(
                                session.user.id,
                                safeTransaction.bankAccountId
                            );
                            if (walletInfo.success && walletInfo.data?.[0]) {
                                walletName = walletInfo.data[0].name;
                            }
                        }

                        return {
                            ...safeTransaction,
                            walletName,
                        };
                    })
                );

                setTransactions(enriched);
            }),
        [session, status]
    );

    const fetchWalletName = async (walletId: string | undefined) => {
        if (!session?.user.id) return "unknown";
        const walletInfo = await getWallets(session?.user.id, walletId);
        if (!walletInfo.success || !walletInfo.data) return "unknown";
        return walletInfo.data[0].name;
    };

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
                        return (
                            <TableRow key={transaction.id}>
                                <TableCell className="font-medium">
                                    {new Date(
                                        transaction.createdAt
                                    ).toLocaleDateString("fr-FR")}
                                </TableCell>
                                <TableCell
                                    className={
                                        transaction.amount >= 0
                                            ? "text-green-700 "
                                            : "text-red-700"
                                    }
                                >
                                    €{transaction.amount}
                                </TableCell>
                                <TableCell>{transaction.walletName}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell className="text-right">
                                    {transaction.tags
                                        .map((tag: Tag) => tag.name)
                                        .join(", ")}
                                </TableCell>
                            </TableRow>
                        );
                    })}
            </TableBody>
        </Table>
    );
}
