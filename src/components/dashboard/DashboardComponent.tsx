import BudgetComponent from "./BudgetComponent";
import DashboardCardComponent from "./CardComponent";
import GoalsComponent from "./GoalsComponent";
import MoneyFlowComponent from "./MoneyFlowComponent";
import RecentTransactions from "./RecentTransactions";

export default function DashboardComponent() {
  return (
    <div className="flex h-full w-full flex-col">
      <div>
        {/* top bar */}
        <div className="flex flex-row w-full bg-amber-400 p-2 gap-2 h-1/3">
          <div className="flex-1">
            <DashboardCardComponent
              title={"Total Balance"}
              amount={10000.56}
              growth={21}
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
        <div className="flex flex-row w-full gap-2 p-2 h-1/3">
          <div className="w-6/10">
            <MoneyFlowComponent />
          </div>
          <div>
            <BudgetComponent />
          </div>
        </div>
        {/* bottom bar */}
        <div className="w-full flex flex-row gap-2 p-2 h-1/3">
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
