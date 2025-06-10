"use client";
import { getWallets } from "@/actions/wallets";
import { Separator } from "@/components/ui/separator";
import NewWalletButtonComponent from "@/components/wallet/NewWalletButtonComponent";
import WalletCardComponent from "@/components/wallet/WalletCardComponent";
import { BankAccount } from "@/generated/prisma";
import ProtectedRoute from "@/wrappers/ProtectedRoute";
import { useSession } from "next-auth/react";
import { startTransition, useEffect, useState } from "react";

export default function WalletPage() {
  const { data: session, status } = useSession();
  const [wallets, setWallets] = useState([] as BankAccount[]);

  useEffect(
    () =>
      startTransition(async () => {
        if (status !== "authenticated") return;
        const fetchedWallets = await getWallets(session.user.id);
        if (fetchedWallets.success && fetchedWallets.data)
          setWallets(fetchedWallets.data);
      }),
    [session, status]
  );

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
            {status === "authenticated" &&
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
