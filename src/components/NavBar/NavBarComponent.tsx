"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function NavBarComponent() {
  const router = useRouter();

  const onWalletClick = () => {
    router.push("/wallet");
  };

  return (
    <div className="flex flex-col gap-2 bg-purple-600 h-full w-full p-4">
      <div>Logo</div>
      <div className="flex flex-col gap-2">
        <Button variant="outline" className="bg-purple-800 text-white">
          Dashboard
        </Button>
        <Button variant="outline" className="bg-purple-800 text-white">
          Transactions
        </Button>
        <Button
          variant="outline"
          className="bg-purple-800 text-white"
          onClick={onWalletClick}
        >
          Wallet
        </Button>
        <Button variant="outline" className="bg-purple-800 text-white">
          Goals
        </Button>
      </div>
    </div>
  );
}
