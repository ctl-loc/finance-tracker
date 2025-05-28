-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_bank_account_id_fkey";

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
