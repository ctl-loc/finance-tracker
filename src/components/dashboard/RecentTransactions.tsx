"use client";
import { TransactionsTable } from "./../transactions/TransactionsTable";
import CardComplexeComponent from "./CardComplexeComponent";

export default function RecentTransactions() {
  return (
    <div className="w-full">
      <CardComplexeComponent title="Recent Transactions">
        <TransactionsTable amount={5} />
      </CardComplexeComponent>
    </div>
  );
}
