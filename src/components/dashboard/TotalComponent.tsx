import { startTransition, useEffect, useState } from "react";
import DashboardCardComponent from "./CardComponent";
import { BankAccount } from "@/generated/prisma";
import { useSession } from "next-auth/react";
import { getHistoryWallet, getWallets } from "@/actions/wallets";
import { getPeriodFormatted } from "@/lib/dates";

export default function TotalComponent({
    dates,
}: {
    dates: {
        selected: Date;
        symetrical: Date;
    };
}) {
    const { data: session, status } = useSession();
    const [wallets, setWallets] = useState([] as BankAccount[]);
    const [currentTotal, setCurrentTotal] = useState(0);
    const [oldTotal, setOldTotal] = useState(0);

    const { selected: selectedDate, symetrical: symetricalDate } = dates;

    // fetch wallet on render
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

    useEffect(
        () =>
            startTransition(async () => {
                if (!wallets) return;
                if (status !== "authenticated") return;

                // Current total calculation
                const currTotal = wallets.reduce(
                    (acc, curr) => acc + curr.balance,
                    0
                );
                setCurrentTotal(currTotal);

                // Old total calculation

                const oldBalances = await Promise.all(
                    wallets.map(async (curr) => {
                        const history = await getHistoryWallet(
                            session.user.id,
                            curr.id,
                            selectedDate
                        );
                        return history.data?.balance ?? curr.balance;
                    })
                );
                const old = oldBalances.reduce(
                    (acc, balance) => acc + balance,
                    0
                );
                setOldTotal(old);
            }),
        [wallets, status, session]
    );

    return (
        <DashboardCardComponent
            title={"Total Balance"}
            amount={currentTotal}
            growth={((currentTotal - oldTotal) * 100) / oldTotal} // calculate percentage
            periodGrowth={getPeriodFormatted(selectedDate)}
        />
    );
}
