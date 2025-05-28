"use client";
import NewTransactionButtonComponent from "@/components/transactions/NewTransactionButtonComponent";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/wrappers/ProtectedRoute";

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full h-full bg-red-400">
        <div className="flex flex-row gap-4 p-4 justify-between">
          <div className="text-2xl font-bold">Your transactions</div>
          <NewTransactionButtonComponent />
        </div>
        <Separator />
        <div className="flex flex-wrap gap-4 p-4">
          <TransactionsTable amount={10} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
