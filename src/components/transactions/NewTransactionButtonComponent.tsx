"use client";

import React from "react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import WalletSelector from "./WalletSelector";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import TagsSelector from "./TagsSelector";
import { Tag } from "@/generated/prisma";
import { addTransaction } from "@/actions/transactions";
import { useSession } from "next-auth/react";

export default function NewTransactionButtonComponent() {
  const { data: session } = useSession();

  const walletState = useState("");
  const tagsState = useState([] as Tag[]);
  const value = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);

  const onSubmitForm = async () => {
    if (!session || !session.user) return;
    if (!walletState[0]) {
      console.warn("[WARN] no wallet name");
      return;
    }

    if (!value.current?.value) {
      console.warn("[WARN] no value");
      return;
    }

    await addTransaction({
      userId: session.user.id,
      bankAccountId: walletState[0],
      amount: +value.current.value,
      description: description.current?.value,
      tags: tagsState[0],
    });

    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-purple-800 text-white aspect-square"
          >
            +
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new transaction</DialogTitle>
            <DialogDescription>
              Fields marked as <span className="text-red-700">*</span> are
              required
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* wallet */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wallet-name" className="text-right gap-1">
                Wallet name<span className="text-red-700">*</span>
              </Label>
              <WalletSelector walletState={walletState} />
            </div>
            {/* value */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right gap-1">
                Amount<span className="text-red-700">*</span>
              </Label>
              <Input
                ref={value}
                id="amount"
                placeholder="500.34"
                className="col-span-3"
              />
            </div>
            {/* description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desc" className="text-right gap-1">
                Description
              </Label>
              <Input
                ref={description}
                id="desc"
                placeholder="YouTube Premium"
                className="col-span-3"
              />
            </div>
            {/* tags */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right gap-1">
                Tags
              </Label>
              <TagsSelector tagsState={tagsState} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"destructive"}>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={onSubmitForm}>
                Save transaction
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// WALLET WORKING
// ask martin for useWallet() if good
// adapt transaction endpoint + recent to work with wallet
