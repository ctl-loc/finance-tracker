import { NextRequest, NextResponse } from "next/server";
import { addWallet, getHistoricalWallet, getWallets } from "@/lib/wallets";
import { BankAccount } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const walletId = searchParams.get("walletId");
  const timeParam = searchParams.get("timeLimit");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }
  if (timeParam && !walletId) {
    return NextResponse.json(
      { error: "Cannot use timeLimit and no walletId" },
      { status: 400 }
    );
  }

  // parse timeLimit parameter
  let timeLimit: Date | undefined = undefined;
  if (timeParam) {
    const parsedDate = new Date(timeParam);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid timeLimit format" },
        { status: 400 }
      );
    }
    timeLimit = parsedDate;
  }

  try {
    let wallets;
    if (!timeLimit) {
      wallets = await getWallets(userId, walletId ?? undefined);
    } else {
      const hist = await getHistoricalWallet(walletId ?? "", timeLimit); // default string does not occur
      wallets = hist ? [hist] : [];
    }

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

    await addWallet(walletTyped);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("[ERROR] Prisma:", error);
    return NextResponse.json(
      { error: "Failed to add new wallet" },
      { status: 500 }
    );
  }
}
