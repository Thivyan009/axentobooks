"use server"

import { cookies } from "next/headers"
import type { Asset, Liability, Equity } from "@/lib/types/onboarding"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

interface FinancialData {
  assets: Asset[]
  liabilities: Liability[]
  equity: Equity[]
}

export async function saveFinancialInfoAction(data: FinancialData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
  })

  if (!business) {
    throw new Error("Business not found")
  }

  return await prisma.$transaction(async (tx) => {
    // Calculate totals for financial position
    const totalAssets = data.assets.reduce((sum, asset) => sum + (asset.value || 0), 0)
    const totalLiabilities = data.liabilities.reduce((sum, liability) => sum + (liability.amount || 0), 0)
    const totalEquity = data.equity.reduce((sum, eq) => sum + (eq.amount || 0), 0)

    // Update financial position
    await tx.financialPosition.upsert({
      where: { businessId: business.id },
      create: {
        businessId: business.id,
        currentAssets: totalAssets, // For simplicity, we'll put all assets as current
        fixedAssets: 0,
        currentLiabilities: totalLiabilities, // For simplicity, we'll put all liabilities as current
        longTermLiabilities: 0,
        commonStock: totalEquity, // For simplicity, we'll put all equity as common stock
        retainedEarnings: 0,
        totalAssets,
        totalLiabilities,
        totalEquity,
        netWorth: totalAssets - totalLiabilities,
      },
      update: {
        currentAssets: totalAssets,
        fixedAssets: 0,
        currentLiabilities: totalLiabilities,
        longTermLiabilities: 0,
        commonStock: totalEquity,
        retainedEarnings: 0,
        totalAssets,
        totalLiabilities,
        totalEquity,
        netWorth: totalAssets - totalLiabilities,
      },
    })

    // Update assets
    await tx.asset.deleteMany({
      where: { businessId: business.id },
    })
    if (data.assets?.length) {
      await tx.asset.createMany({
        data: data.assets.map(asset => ({
          businessId: business.id,
          name: asset.description || 'Unnamed Asset',
          type: asset.type,
          value: asset.value,
          purchaseDate: asset.purchaseDate,
        })),
      })
    }

    // Update liabilities
    await tx.liability.deleteMany({
      where: { businessId: business.id },
    })
    if (data.liabilities?.length) {
      await tx.liability.createMany({
        data: data.liabilities.map(liability => ({
          businessId: business.id,
          name: liability.name,
          type: liability.type,
          amount: liability.amount,
          dueDate: liability.dueDate,
        })),
      })
    }

    // Update equity details
    await tx.equityDetail.deleteMany({
      where: { businessId: business.id },
    })
    if (data.equity?.length) {
      await tx.equityDetail.createMany({
        data: data.equity.map(eq => ({
          businessId: business.id,
          type: eq.type,
          amount: eq.amount,
          description: eq.description,
        })),
      })
    }

    return { success: true }
  })
}

