/*
  Warnings:

  - You are about to drop the `_TransactionTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TransactionTags" DROP CONSTRAINT "_TransactionTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_TransactionTags" DROP CONSTRAINT "_TransactionTags_B_fkey";

-- DropTable
DROP TABLE "_TransactionTags";

-- CreateTable
CREATE TABLE "_TagToTransaction" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TagToTransaction_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TagToTransaction_B_index" ON "_TagToTransaction"("B");

-- AddForeignKey
ALTER TABLE "_TagToTransaction" ADD CONSTRAINT "_TagToTransaction_A_fkey" FOREIGN KEY ("A") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTransaction" ADD CONSTRAINT "_TagToTransaction_B_fkey" FOREIGN KEY ("B") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
