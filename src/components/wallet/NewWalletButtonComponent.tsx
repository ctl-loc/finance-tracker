"use client";
import { startTransition, useEffect, useRef } from "react";
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
import useWallet from "@/hooks/wallet";
import extendedPrisma from "@/lib/prisma";
import { useSession } from "next-auth/react";
import { getWallets } from "@/actions/getWallet";

export default function NewWalletButtonComponent() {
  const { addWallet } = useWallet();
  const { data: session } = useSession();

  const walletName = useRef<HTMLInputElement>(null);
  const baseAccountValue = useRef<HTMLInputElement>(null);

  const onSubmitForm = async () => {
    if (!walletName.current?.value) {
      console.warn("[WARN] no wallet name");
      return;
    }

    // if value, cast as a number
    // else use undefined
    await addWallet(
      walletName.current?.value,
      baseAccountValue.current?.value
        ? +baseAccountValue.current?.value
        : undefined
    );
  };

  useEffect(
    () =>
      startTransition(async () => {
        await getWallets();
      }),
    []
  );

  return <Button></Button>;
  // return (
  //   <div className="flex flex-col gap-2">
  //     <Drawer>
  //       <DrawerTrigger asChild>
  //         <Button
  //           variant="outline"
  //           className="bg-purple-800 text-white aspect-square"
  //         >
  //           +
  //         </Button>
  //       </DrawerTrigger>
  //       <DrawerContent>
  //         <DrawerHeader>
  //           <DrawerTitle>Add a new wallet</DrawerTitle>
  //         </DrawerHeader>
  //         <DrawerFooter>
  //           <div className="flex flex-col gap-4 w-4/5 justify-center">
  //             <div className="flex flex-col gap-2">
  //               <label htmlFor="wallet-name">Wallet name</label>
  //               <input
  //                 ref={walletName}
  //                 type="text"
  //                 placeholder="Enter wallet name"
  //                 className="border border-gray-300 rounded-md p-2"
  //               />
  //             </div>

  //             <div className="flex flex-col gap-2">
  //               <label htmlFor="wallet-name">Base account value</label>
  //               <input
  //                 ref={baseAccountValue}
  //                 type="text"
  //                 placeholder="Enter wallet name"
  //                 className="border border-gray-300 rounded-md p-2"
  //               />
  //             </div>
  //           </div>

  //           <div className="flex gap-4 justify-center">
  //             <DrawerClose asChild>
  //               <Button onClick={onSubmitForm}>Submit</Button>
  //             </DrawerClose>
  //             <DrawerClose asChild>
  //               <Button variant="outline">Cancel</Button>
  //             </DrawerClose>
  //           </div>
  //         </DrawerFooter>
  //       </DrawerContent>
  //     </Drawer>
  //   </div>
  // );
}
