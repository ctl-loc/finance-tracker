import { useState } from "react";
import { Separator } from "../ui/separator";
import BudgetComponent from "./BudgetComponent";
import DashboardCardComponent from "./CardComponent";
import { DatePickerComponent } from "./DatePickComponent";
import GoalsComponent from "./GoalsComponent";
import IncomeComponent from "./IncomeComponent";
import MoneyFlowComponent from "./MoneyFlowComponent";
import RecentTransactions from "./RecentTransactions";
import TotalComponent from "./TotalComponent";
import { getDashboardDates } from "@/lib/dates";
import ExpensesComponent from "./ExpensesComponent";
import SavingsComponent from "./SavingsComponent";

export default function DashboardComponent() {
  const [date, setDate] = useState<Date>();
  return (
    <div className="flex flex-col justify-start h-full w-full">
      <div className="flex flex-col h-full w-full flex-1">
        {/* header ? */}
        <div className="flex flex-row bg-amber-200">
          <DatePickerComponent date={date} setter={setDate} />
        </div>
        <Separator />
        {/* top bar */}
        <div className="flex flex-row w-full p-2 gap-2 flex-1">
          <div className="flex-1">
            <TotalComponent dates={getDashboardDates(date)} />
          </div>
          <div className="flex-1">
            <IncomeComponent dates={getDashboardDates(date)} />
          </div>
          <div className="flex-1">
            <ExpensesComponent dates={getDashboardDates(date)} />
          </div>
          <div className="flex-1">
            <SavingsComponent dates={getDashboardDates(date)} />
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
