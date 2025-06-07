import useWallet from "@/hooks/wallet";
import BudgetComponent from "./BudgetComponent";
import DashboardCardComponent from "./CardComponent";
import GoalsComponent from "./GoalsComponent";
import MoneyFlowComponent from "./MoneyFlowComponent";
import RecentTransactions from "./RecentTransactions";
import { startTransition, useEffect, useState } from "react";

export default function DashboardComponent() {
  const { wallets, getWallets } = useWallet();

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountOld, setTotalAmountOld] = useState(0);

  useEffect(
    () =>
      startTransition(async () => {
        if (!wallets) return;
        const total = wallets.reduce((acc, curr) => acc + curr.balance, 0);
        setTotalAmount(total);

        // total last month calculation
        const fetchOldBalances = async () => {
          // for each wallet, fetch its balance 1month ago
          const balances = await Promise.all(
            wallets.map(async (curr) => {
              const walletList = await getWallets(
                curr.id,
                new Date(new Date().setMonth(new Date().getMonth() - 1))
              ); // one month ago

              return walletList[0]?.balance;
            })
          );

          const totalOld = balances.reduce((acc, balance) => acc + balance, 0);
          console.log(totalAmountOld);
          setTotalAmountOld(totalOld);
        };
        fetchOldBalances();
      }),
    [wallets]
  );

  return (
    <div className="flex flex-col justify-start h-full w-full">
      <div className="flex flex-col h-full w-full flex-1">
        {/* top bar */}
        <div className="flex flex-row w-full p-2 gap-2 flex-1">
          <div className="flex-1">
            <DashboardCardComponent
              title={"Total Balance"}
              amount={totalAmount}
              growth={((totalAmount - totalAmountOld) * 100) / totalAmountOld} // calculate percentage
              periodGrowth={"last month"}
            />
          </div>
          <div className="flex-1">
            <DashboardCardComponent
              title={"Incomes"}
              amount={200}
              growth={-2}
              periodGrowth={"last month"}
            />
          </div>
          <div className="flex-1">
            <DashboardCardComponent
              title={"Expenses"}
              amount={200}
              growth={-2}
              periodGrowth={"last month"}
            />
          </div>
          <div className="flex-1">
            <DashboardCardComponent
              title={"Total Savings"}
              amount={200}
              growth={-2}
              periodGrowth={"last month"}
            />
          </div>
        </div>
        {/* middle bar */}
        <div className="flex flex-row w-full gap-2 p-2 flex-1">
          <div className="w-6/10">
            <MoneyFlowComponent />
          </div>
          <div>
            <BudgetComponent />
          </div>
        </div>
        {/* bottom bar */}
        <div className="w-full flex flex-row gap-2 p-2 flex-1">
          <div className="flex w-6/10">
            <RecentTransactions />
          </div>
          <div>
            <GoalsComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
