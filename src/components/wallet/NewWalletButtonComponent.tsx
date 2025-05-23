"use client";
import { useRef } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import api from "@/lib/api";
import { useSession } from "next-auth/react";

export default function NewWalletButtonComponent() {
  const { data: session } = useSession();

  const walletName = useRef<HTMLInputElement>(null);
  const baseAccountValue = useRef<HTMLInputElement>(null);

  const onSubmitForm = async () => {
    // add wallet to the database
    await api.post("/wallets", {
      wallet: {
        name: walletName.current?.value,
        baseAccountValue: baseAccountValue.current?.value,
        userId: session?.user.id,
      },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="bg-purple-800 text-white aspect-square"
          >
            +
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add a new wallet</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <div className="flex flex-col gap-4 w-4/5 justify-center">
              <div className="flex flex-col gap-2">
                <label htmlFor="wallet-name">Wallet name</label>
                <input
                  ref={walletName}
                  type="text"
                  placeholder="Enter wallet name"
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="wallet-name">Base account value</label>
                <input
                  ref={baseAccountValue}
                  type="text"
                  placeholder="Enter wallet name"
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <DrawerClose asChild>
                <Button onClick={onSubmitForm}>Submit</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

// WALLET WORKING
// ask martin for useWallet() if good
// adapt transaction endpoint + recent to work with wallet
