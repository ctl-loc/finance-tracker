import { Tag, Transaction } from "@/generated/prisma";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const useTransactions = () => {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch transaction from the api
  const fetchTransactions = useCallback(async () => {
    if (!session || !session.user) return;
    setLoading(true);

    try {
      const trans = await api.get("/transactions", {
        params: { user_id: session.user.id },
      });
      setTransactions(trans.data);
    } catch (error) {
      console.error("[ERROR] fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  // function to get specific transactions
  const getTransactions = useCallback(
    (amount: number | undefined, account: string | undefined) => {
      let selectedTransactions = transactions;

      // filter by account if present
      if (account) {
        selectedTransactions = selectedTransactions.filter(
          (transaction: Transaction) => transaction.bankAccountId === account
        );
      }
      // return specific amount if registered
      if (amount) {
        selectedTransactions = selectedTransactions.slice(0, amount);
      }

      return selectedTransactions;
    },
    [transactions]
  );

  const addTransaction = useCallback(
    async ({
      accountId,
      value,
      description,
      tags,
    }: {
      accountId: string;
      value: number;
      description?: string;
      tags?: Tag[];
    }) => {
      try {
        await api.post("/transactions", {
          transaction: {
            userId: session?.user.id,
            accountId: accountId,
            amount: value,
            description: description,
            tags: tags,
          },
        });
        fetchTransactions();
      } catch (error) {
        console.error("[ERROR] adding transaction : ", error);
      }
    },
    [fetchTransactions, session?.user.id]
  );

  // Automatically fetch once session is ready
  useEffect(() => {
    if (status === "authenticated") fetchTransactions();
  }, [status, fetchTransactions]);

  return {
    transactions,
    loading,
    fetchTransactions,
    getTransactions,
    addTransaction,
  };
};

export default useTransactions;
