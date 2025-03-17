-- CreateTable
CREATE TABLE "FinancialPosition" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "currentAssets" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fixedAssets" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentLiabilities" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "longTermLiabilities" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commonStock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "retainedEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAssets" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalLiabilities" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEquity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netWorth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialPosition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinancialPosition_businessId_key" ON "FinancialPosition"("businessId");

-- CreateIndex
CREATE INDEX "FinancialPosition_businessId_idx" ON "FinancialPosition"("businessId");

-- AddForeignKey
ALTER TABLE "FinancialPosition" ADD CONSTRAINT "FinancialPosition_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
