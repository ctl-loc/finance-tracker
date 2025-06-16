"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { startTransition, useEffect, useState } from "react";
import { BankAccount } from "@/generated/prisma";
import { useSession } from "next-auth/react";
import { getWallets } from "@/actions/wallets";

export default function WalletSelector({
    walletState,
}: {
    walletState: [string, React.Dispatch<React.SetStateAction<string>>];
}) {
    const { data: session, status } = useSession();
    const [wallets, setWallets] = useState([] as BankAccount[]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = walletState;

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
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? wallets.find((wallet) => wallet.id === value)?.name
                        : "Select wallet..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search wallet..." />
                    <CommandList>
                        <CommandEmpty>No wallet found.</CommandEmpty>
                        <CommandGroup>
                            {wallets.map((wallet) => (
                                <CommandItem
                                    key={wallet.id}
                                    value={wallet.name}
                                    onSelect={() => {
                                        setValue(
                                            wallet.id === value ? "" : wallet.id
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === wallet.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    <div className="flex w-full flex-row justify-between items-center">
                                        <span>{wallet.name}</span>
                                        <span>{wallet.balance}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
