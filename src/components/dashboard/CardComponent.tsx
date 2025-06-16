import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

export default function DashboardCardComponent({
    title,
    amount,
    growth,
    periodGrowth,
}: {
    title: string;
    amount: number;
    growth: number;
    periodGrowth: string;
}) {
    const { whole, decimal } = formatNumber(amount);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl text-blue-900 font-bold">
                    €{whole}
                    <span className="text-gray-300">.{decimal}</span>
                </div>
            </CardContent>
            <CardFooter>
                {Number.isNaN(growth) ? (
                    <div>No data on growth for this time window</div>
                ) : (
                    <div>
                        {growth > 0 ? <span>+</span> : <></>}
                        {growth}% over {periodGrowth}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}

const formatNumber = (number: number) => {
    const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);

    const [whole, decimal] = formatted.split(".");
    return { whole, decimal };
};
