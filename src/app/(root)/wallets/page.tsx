"use client";
import { Separator } from "@/components/ui/separator";
import NewWalletButtonComponent from "@/components/wallet/NewWalletButtonComponent";
import WalletCardComponent from "@/components/wallet/WalletCardComponent";
import { BankAccount } from "@/generated/prisma";
import useWallet from "@/hooks/wallet";
import ProtectedRoute from "@/wrappers/ProtectedRoute";
import { useEffect } from "react";

export default function WalletPage() {
  const { wallets, loading, fetchWallets } = useWallet();

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full h-full bg-red-400">
        <div className="w-full h-full  ">
          <div className="flex flex-row gap-4 p-4 justify-between">
            <div className="text-2xl font-bold">Your wallets</div>
            <NewWalletButtonComponent />
          </div>
          <Separator />
          {/* all wallets */}
          <div className="flex flex-wrap gap-4 p-4">
            {!loading &&
              wallets.map((wallet: BankAccount) => (
                <div className="flex" key={wallet.id}>
                  <WalletCardComponent wallet={wallet} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
