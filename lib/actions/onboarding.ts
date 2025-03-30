"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import type { OnboardingData } from "@/lib/types/onboarding"
import { auth } from "../auth"

export async function saveOnboardingData(userId: string, data: OnboardingData) {
  const { businessInfo, financialGoals, assets, liabilities, equity } = data

  return await prisma.$transaction(async (tx) => {
    // First get or create the business
    const business = await tx.business.upsert({
      where: { userId },
      create: {
        userId,
        name: businessInfo.name,
        industry: businessInfo.industry,
        registrationNo: businessInfo.registrationNumber,
        taxId: businessInfo.taxId,
      },
      update: {
        name: businessInfo.name,
        industry: businessInfo.industry,
        registrationNo: businessInfo.registrationNumber,
        taxId: businessInfo.taxId,
      },
    })

    // Calculate totals for financial position
    const totalAssets = assets.reduce((sum, asset) => sum + (asset.value || 0), 0)
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + (liability.amount || 0), 0)
    const totalEquity = equity.reduce((sum, eq) => sum + (eq.amount || 0), 0)

    // Create initial financial position
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

    // Create financial goals
    if (financialGoals?.length) {
      await tx.financialGoal.createMany({
        data: financialGoals.map(goal => ({
          businessId: business.id,
          title: goal.title || "Untitled Goal",
          targetAmount: goal.targetAmount || 0,
          currentAmount: 0,
          deadline: goal.deadline || new Date(),
          status: goal.status || "IN_PROGRESS",
        })),
      })
    }

    // Create assets
    if (assets?.length) {
      await tx.asset.createMany({
        data: assets.map(asset => ({
          businessId: business.id,
          name: asset.description || 'Unnamed Asset',
          type: asset.type,
          value: asset.value,
          purchaseDate: asset.purchaseDate,
        })),
      })
    }

    // Create liabilities
    if (liabilities?.length) {
      await tx.liability.createMany({
        data: liabilities.map(liability => ({
          businessId: business.id,
          name: liability.name,
          type: liability.type,
          amount: liability.amount,
          dueDate: liability.dueDate,
        })),
      })
    }

    // Create equity details
    if (equity?.length) {
      await tx.equityDetail.createMany({
        data: equity.map(eq => ({
          businessId: business.id,
          type: eq.type,
          amount: eq.amount,
          description: eq.description,
        })),
      })
    }

    return business
  })
}

export async function completeOnboardingAction(userId: string) {
  try {
    console.log("Starting onboarding completion for user:", userId)
    
    if (!userId) {
      console.error("No userId provided")
      throw new Error("UserId is required")
    }

    // Use upsert to handle both creation and update cases
    const result = await prisma.userSettings.upsert({
      where: {
        userId
      },
      create: {
        userId,
        onboardingCompleted: true,
        theme: "light",
        emailNotifications: true
      },
      update: {
        onboardingCompleted: true
      }
    })

    console.log("User settings updated successfully:", result)
    
    // Redirect to dashboard
    redirect("/dashboard")
  } catch (error) {
    console.error("Detailed onboarding error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      userId
    })
    throw error // Throw the original error to preserve the stack trace
  }
}

export async function resetOnboardingAction(userId: string) {
  try {
    // Reset onboarding status
    await prisma.userSettings.update({
      where: { userId },
      data: {
        onboardingCompleted: false
      }
    })
    
    // Redirect to onboarding
    redirect("/onboarding/controller")
  } catch (error) {
    console.error("Failed to reset onboarding:", error)
    throw new Error("Failed to reset onboarding")
  }
}

export async function resetAndRedirectAction() {
  "use server"
  
  try {
    // Get current user settings
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Not authenticated")
    }

    // Reset onboarding status
    await prisma.userSettings.update({
      where: { userId: session.user.id },
      data: {
        onboardingCompleted: false
      }
    })

    // Redirect to onboarding
    redirect("/onboarding/controller")
  } catch (error) {
    console.error("Failed to reset and redirect:", error)
    throw new Error("Failed to reset and redirect to onboarding")
  }
}

