-- CreateTable
CREATE TABLE "bank_account_history" (
    "id" TEXT NOT NULL,
    "bank_account_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_account_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bank_account_history_bank_account_id_validFrom_idx" ON "bank_account_history"("bank_account_id", "validFrom");

-- AddForeignKey
ALTER TABLE "bank_account_history" ADD CONSTRAINT "bank_account_history_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
