import { NextRequest, NextResponse } from "next/server";
import { addTag, getTags } from "@/lib/tags";
import { Tag } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  try {
    const tags = await getTags(userId);

    return NextResponse.json(tags);
  } catch (error) {
    console.error("[ERROR] Prisma:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { tag } = await req.json();

  // Validate tag object
  if (
    !tag ||
    !tag.name ||
    typeof tag.name !== "string" ||
    !tag.userId ||
    typeof tag.userId !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing or invalid tag" },
      { status: 400 }
    );
  }

  try {
    const newTag = await addTag(tag as Tag);

    return NextResponse.json({ status: 200, tag: newTag });
  } catch (error) {
    console.error("[ERROR] Prisma:", error);
    return NextResponse.json(
      { error: "Failed to add new tag" },
      { status: 500 }
    );
  }
}
