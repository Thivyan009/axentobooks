-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_bankStatementId_fkey";

-- CreateTable
CREATE TABLE "AIInsights" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "insights" JSONB[],
    "recommendations" JSONB[],
    "riskFactors" JSONB[],
    "opportunities" JSONB[],
    "summary" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIInsights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIInsights_businessId_idx" ON "AIInsights"("businessId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bankStatementId_fkey" FOREIGN KEY ("bankStatementId") REFERENCES "bank_statements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIInsights" ADD CONSTRAINT "AIInsights_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
