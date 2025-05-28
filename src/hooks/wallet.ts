import { BankAccount } from "@/generated/prisma";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const useWallet = () => {
  const { data: session, status } = useSession();
  const [wallets, setWallets] = useState([] as BankAccount[]);
  const [loading, setLoading] = useState(true);

  const fetchWallets = useCallback(async () => {
    if (!session || !session.user) return;
    setLoading(true);

    try {
      const wallets = await api.get("/wallets", {
        params: { userId: session?.user.id },
      });
      setWallets(wallets.data);
      console.info("[INFO] wallets fetched");
    } catch (error) {
      console.error("[ERROR] fetching wallets:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const addWallet = useCallback(
    async (name: string, baseValue: number | undefined) => {
      try {
        const newWallet = await api.post("/wallets", {
          wallet: {
            name: name,
            baseAccountValue: baseValue ?? 0,
            userId: session?.user.id,
          },
        });
        fetchWallets();
        console.info("[INFO] wallets added");
        return newWallet;
      } catch (error) {
        console.error("[ERROR] adding new wallet : ", error);
        return undefined;
      }
    },
    [fetchWallets, session]
  );

  // Automatically fetch once session is ready
  useEffect(() => {
    if (status === "authenticated") {
      fetchWallets();
    }
  }, [status, fetchWallets]);

  return { wallets, loading, fetchWallets, addWallet };
};

export default useWallet;
