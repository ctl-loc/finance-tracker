import { NextRequest, NextResponse } from "next/server";
import { addTransaction, getRecentTransactions } from "@/lib/transactions";
import { Tag } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  const walletId = searchParams.get("walletId");
  const timeParam = searchParams.get("timeLimit");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
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
    const transactions = await getRecentTransactions(
      userId,
      walletId ?? undefined,
      timeLimit ?? undefined
    );

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("[ERROR] Prisma:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { transaction } = (await req.json()) as {
    transaction: {
      userId: string;
      accountId: string;
      amount: number;
      description?: string | null;
      tags: Array<Tag>;
    };
  };

  // Validate transaction object
  if (
    !transaction ||
    typeof transaction !== "object" ||
    !transaction.userId ||
    typeof transaction.userId !== "string" ||
    !transaction.accountId ||
    typeof transaction.accountId !== "string" ||
    !transaction.amount ||
    typeof transaction.amount !== "number"
  ) {
    return NextResponse.json(
      { error: "Missing or invalid transaction" },
      { status: 400 }
    );
  }

  try {
    await addTransaction({
      userId: transaction.userId,
      bankAccountId: transaction.accountId,
      amount: transaction.amount,
      description: transaction.description,
      tags: transaction.tags,
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("[ERROR] Prisma:", error);
    return NextResponse.json(
      { error: "Failed to add new transactions" },
      { status: 500 }
    );
  }
}
