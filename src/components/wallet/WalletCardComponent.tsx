import { BankAccount } from "@/generated/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function WalletCardComponent({
    wallet,
}: {
    wallet: BankAccount;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{wallet.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl text-blue-900 font-bold">
                    €{wallet.balance}
                </div>
            </CardContent>
        </Card>
    );
}
