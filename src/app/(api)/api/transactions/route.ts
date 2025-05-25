import { NextRequest, NextResponse } from "next/server";
import { addTransaction, getRecentTransactions } from "@/lib/transactions";

export async function GET(req: NextRequest) {
  console.log(req.url);
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  try {
    const transactions = await getRecentTransactions(userId);

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
  const { transaction } = await req.json();
  console.log("Transaction:", transaction);
  // Validate transaction object
  if (
    !transaction ||
    typeof transaction !== "object" ||
    !transaction.userId ||
    typeof transaction.userId !== "string" ||
    !transaction.amount ||
    typeof transaction.amount !== "number" ||
    !transaction.description ||
    typeof transaction.description !== "string" ||
    !transaction.tags ||
    !Array.isArray(transaction.tags)
  ) {
    return NextResponse.json(
      { error: "Missing or invalid transaction" },
      { status: 400 }
    );
  }

  try {
    await addTransaction(transaction);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("[ERROR] Prisma:", error);
    return NextResponse.json(
      { error: "Failed to add new transactions" },
      { status: 500 }
    );
  }
}
