/*
  Warnings:

  - You are about to drop the `BankStatementTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoice_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoices` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `businessId` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankStatementTransaction" DROP CONSTRAINT "BankStatementTransaction_businessId_fkey";

-- DropForeignKey
ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_customerId_fkey";

-- DropIndex
DROP INDEX "customers_email_key";

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "businessId" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "BankStatementTransaction";

-- DropTable
DROP TABLE "invoice_items";

-- DropTable
DROP TABLE "invoices";

-- CreateTable
CREATE TABLE "bank_statement_transactions" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "income" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expense" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balance" DOUBLE PRECISION NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_statement_transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bank_statement_transactions" ADD CONSTRAINT "bank_statement_transactions_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
