import BudgetComponent from "./BudgetComponent";
import DashboardCardComponent from "./CardComponent";
import GoalsComponent from "./GoalsComponent";
import MoneyFlowComponent from "./MoneyFlowComponent";
import RecentTransactions from "./RecentTransactions";
import TotalComponent from "./TotalComponent";

export default function DashboardComponent() {
  return (
    <div className="flex flex-col justify-start h-full w-full">
      <div className="flex flex-col h-full w-full flex-1">
        {/* top bar */}
        <div className="flex flex-row w-full p-2 gap-2 flex-1">
          <div className="flex-1">
            <TotalComponent />
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
