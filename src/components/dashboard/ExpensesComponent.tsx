import { startTransition, useEffect, useState } from "react";
import DashboardCardComponent from "./CardComponent";
import { useSession } from "next-auth/react";
import { getTransactions } from "@/actions/transactions";
import { getPeriodFormatted } from "@/lib/dates";

export default function ExpensesComponent({
    dates,
}: {
    dates: { selected: Date; symetrical: Date };
}) {
    const { data: session, status } = useSession();

    const [currentPeriod, setCurrentPeriod] = useState(0);
    const [lastPeriod, setLastPeriod] = useState(0);

    const { selected: selectedDate, symetrical: symetricalDate } = dates;

    // fetch values for the card
    useEffect(
        () =>
            startTransition(async () => {
                if (!session || !session.user.id) return;

                const transactions = await getTransactions(
                    session?.user.id,
                    undefined,
                    { from: symetricalDate }
                ); // fetch all transactions from all wallets

                if (!transactions.success || !transactions.data) return;

                // compute values
                const currTransactions = transactions.data.filter(
                    (trans) => trans.createdAt > selectedDate
                );
                const lastTransactions = transactions.data.filter(
                    (trans) => trans.createdAt <= selectedDate
                );

                // for each transaction period, compute value (with destructor logic)
                const [currPeriodLoss, lastPeriodLoss] = [
                    currTransactions,
                    lastTransactions,
                ].map((period) =>
                    period.reduce(
                        (acc, curr) =>
                            curr.amount < 0 ? curr.amount + acc : acc,
                        0
                    )
                );

                setCurrentPeriod(currPeriodLoss);
                setLastPeriod(lastPeriodLoss);
            }),
        [status, session, dates]
    );

    return (
        <DashboardCardComponent
            title={"Expenses"}
            amount={currentPeriod}
            growth={((currentPeriod - lastPeriod) * 100) / lastPeriod} // calculate percentage
            periodGrowth={getPeriodFormatted(selectedDate)}
        />
    );
}
