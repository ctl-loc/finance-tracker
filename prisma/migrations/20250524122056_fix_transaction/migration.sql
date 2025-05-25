/*
  Warnings:

  - Added the required column `bank_account_id` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_user_id_fkey";

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "bank_account_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
