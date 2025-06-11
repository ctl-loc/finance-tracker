"use server";

import { User } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function login(
  username: string,
  password: string
): Promise<{ user?: User; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: username },
    });

    if (!user) {
      return { error: "User not found" };
    }
    if (!(await bcrypt.compare(password, user.password as string))) {
      return { error: "Invalid password" };
    }

    return { user };
  } catch (error) {
    console.error(error);
    return { error: "Internal server error" };
  }
}

export async function register(
  username: string,
  password: string
): Promise<void> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: username,
        password: hashedPassword,
      },
    });

    console.info("[INFO] Registration successful");
  } catch (error) {
    console.error(error);
  }
}
