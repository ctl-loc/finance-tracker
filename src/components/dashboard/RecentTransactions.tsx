"use client";
import { Transaction } from "@/generated/prisma";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import CardComplexeComponent from "./CardComplexeComponent";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function RecentTransactions() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch 5 most recent transactions
  const fetchTransactions = async () => {
    if (!session?.user?.id) return;

    try {
      const res = await api.get("/transactions", {
        params: { user_id: session.user.id, amount: 5 },
      });

      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  };

  // load transactions into the state
  useEffect(() => {
    fetchTransactions();
  }, [session]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <CardComplexeComponent title="Recent Transactions">
        {/* Recent transaction table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction: Transaction) => (
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
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="text-right">
                  {transaction.tags.join(", ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardComplexeComponent>
    </div>
  );
}
