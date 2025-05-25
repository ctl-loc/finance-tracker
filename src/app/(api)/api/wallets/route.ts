import { NextRequest, NextResponse } from "next/server";
import { addWallet, getWallets } from "@/lib/wallets";
import { BankAccount } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  try {
    const wallets = await getWallets(userId);

    return NextResponse.json(wallets);
  } catch (error) {
    console.error("[ERROR] Prisma:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { wallet } = await req.json();
  console.log("wallet:", wallet);
  // Validate wallet object
  if (
    !wallet ||
    typeof wallet !== "object" ||
    !wallet.userId ||
    typeof wallet.userId !== "string" ||
    !wallet.name ||
    typeof wallet.name !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing or invalid wallet" },
      { status: 400 }
    );
  }

  try {
    const walletTyped = {
      userId: wallet.userId,
      name: wallet.name,
      balance: +wallet.baseAccountValue,
    };

    await addWallet(walletTyped as BankAccount);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("[ERROR] Prisma:", error);
    return NextResponse.json(
      { error: "Failed to add new wallet" },
      { status: 500 }
    );
  }
}
