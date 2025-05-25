"use client";
import { Transaction } from "@/generated/prisma";
import CardComplexeComponent from "./CardComplexeComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import useTransactions from "@/hooks/transactions";

export default function RecentTransactions() {
  const { loading, getTransactions } = useTransactions();

  const transactions = getTransactions(5, undefined);
  console.log(transactions);

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
