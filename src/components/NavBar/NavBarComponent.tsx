"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const buttonsValue = [
  {
    name: "Dashboard",
    action: (router: AppRouterInstance) => {
      router.push("/dashboard");
    },
  },
  {
    name: "Transaction",
    action: (router: AppRouterInstance) => {
      router.push("/transactions");
    },
  },
  {
    name: "Wallet",
    action: (router: AppRouterInstance) => {
      router.push("/wallets");
    },
  },
  {
    name: "Goals",
    action: (router: AppRouterInstance) => {
      router.push("/goals");
    },
  },
];

export default function NavBarComponent() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 bg-purple-600 h-full w-full p-4">
      <div>Logo</div>
      <div className="flex flex-col gap-2">
        {/* each button */}
        {buttonsValue.map(({ name, action }) => (
          <Button
            variant="outline"
            className="bg-purple-800 text-white"
            onClick={() => action(router)}
            key={name}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}
