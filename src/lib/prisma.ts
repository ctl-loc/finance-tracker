/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, Prisma } from "@/generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Create base client
const basePrisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["query"] });

// Define a type for the history data
type BankAccountHistoryData = {
  id: string;
  userId: string;
  name: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
};

// Helper functions for history tracking
const createHistoryRecord = async (
  client: PrismaClient,
  data: BankAccountHistoryData,
  validFrom: Date
) => {
  await client.bankAccountHistory.create({
    data: {
      bankAccountId: data.id,
      userId: data.userId,
      name: data.name,
      balance: data.balance,
      validFrom: validFrom,
      validTo: new Date("9999-12-31"),
    },
  });
};

const closeHistoryRecord = async (
  client: PrismaClient,
  bankAccountId: string,
  validTo: Date
) => {
  await client.bankAccountHistory.updateMany({
    where: {
      bankAccountId: bankAccountId,
      validTo: new Date("9999-12-31"),
    },
    data: { validTo },
  });
};

// Type guard to ensure required fields exist
const isBankAccountHistoryData = (
  data: any
): data is BankAccountHistoryData => {
  return (
    typeof data?.id === "string" &&
    typeof data?.userId === "string" &&
    typeof data?.name === "string" &&
    typeof data?.balance === "number" &&
    data?.createdAt instanceof Date &&
    data?.updatedAt instanceof Date
  );
};

const extendedPrisma = basePrisma.$extends({
  name: "BankAccountHistory",
  query: {
    bankAccount: {
      async create(params) {
        // Destructure parameters correctly
        const { args, query: originalQuery } = params;
        const result = await originalQuery(args);

        // Validate and extract required fields
        if (!isBankAccountHistoryData(result)) {
          throw new Error("Missing required fields for history record");
        }

        await createHistoryRecord(basePrisma, result, new Date());
        return result;
      },

      async update(params) {
        const { args, query: originalQuery } = params;
        const currentState = await basePrisma.bankAccount.findUnique({
          where: args.where,
        });

        if (!currentState) return await originalQuery(args);

        const result = await originalQuery(args);
        const now = new Date();

        if (!isBankAccountHistoryData(result)) {
          throw new Error("Missing required fields for history record");
        }

        await closeHistoryRecord(basePrisma, currentState.id, now);
        await createHistoryRecord(basePrisma, result, now);

        return result;
      },

      async delete(params) {
        const { args, query: originalQuery } = params;
        const currentState = await basePrisma.bankAccount.findUnique({
          where: args.where,
        });

        const result = await originalQuery(args);
        const now = new Date();

        if (currentState) {
          await closeHistoryRecord(basePrisma, currentState.id, now);
        }

        return result;
      },
    },
  },
});

// Handle Next.js hot reloading
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = extendedPrisma as any;
}

export default extendedPrisma;
