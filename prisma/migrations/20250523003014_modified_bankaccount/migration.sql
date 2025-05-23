/*
  Warnings:

  - You are about to drop the column `accountType` on the `bank_account` table. All the data in the column will be lost.
  - Added the required column `name` to the `bank_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bank_account" DROP COLUMN "accountType",
ADD COLUMN     "name" TEXT NOT NULL;
