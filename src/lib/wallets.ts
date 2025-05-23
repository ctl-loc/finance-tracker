import prisma from "./prisma";

export const addWallet = async (wallet) => {
  console.log("++++++++++++++++++++++", wallet.balance);
  await prisma.bankAccount.create({
    // data: { ...wallet },
    data: {
      userId: wallet.userId,
      name: wallet.name,
      balance: wallet.balance,
    },
  });
};

export const getWallets = async (userId: string) => {
  return await prisma.bankAccount.findMany({
    where: {
      userId: userId,
    },
  });
};
