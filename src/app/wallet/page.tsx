"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NewWalletButtonComponent from "@/components/wallet/NewWalletButtonComponent";
import { BankAccount } from "@/generated/prisma";
import api from "@/lib/api";
import ProtectedRoute from "@/wrappers/ProtectedRoute";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function WalletPage() {
  const { data: session } = useSession();

  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWallets = async () => {
    if (!session) return;

    try {
      const wallets = await api.get("/wallets", {
        params: { userId: session?.user.id },
      });

      setWallets(wallets.data);
    } catch (error) {
      console.error("[ERROR] fetching wallets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [session]);

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full flex-row">
        <div className="h-full w-1/5 bg-amber-100">NavBar</div>
        <div className="flex flex-col w-full bg-red-400">
          <div className="h-1/10">Header</div>
          <div className="w-full h-full bg-blue-500 ">
            <div className="flex flex-row gap-4 p-4 justify-between">
              <div className="text-2xl font-bold">Your wallets</div>
              <NewWalletButtonComponent />
            </div>
            <Separator />
            {/* all wallets */}
            {!loading &&
              wallets.map((wallet: BankAccount) => <div>{wallet.id}</div>)}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
