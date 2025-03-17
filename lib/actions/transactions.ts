"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import type { Transaction, TransactionType, AccountType } from "@/lib/types"

// Define TransactionStatus type
type TransactionStatus = "Processing" | "Completed" | "Failed"

const transactionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["expense", "income"] as const),
  accountType: z.enum(["cash", "bank", "credit"] as const),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
})

type CreateTransactionInput = z.infer<typeof transactionSchema>

export async function getTransactions() {
  try {
    const session = await auth()
    console.log("Auth Debug - Session:", {
      exists: !!session,
      userId: session?.user?.id,
      user: session?.user
    })
    
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const business = await prisma.business.findUnique({
      where: { userId: session.user.id },
    })
    console.log("Auth Debug - Business:", {
      exists: !!business,
      businessId: business?.id,
      businessName: business?.name,
      userId: business?.userId
    })

    if (!business) {
      return { error: "Business not found" }
    }

    const transactions = await prisma.transaction.findMany({
      where: { businessId: business.id },
      orderBy: { date: 'desc' },
    })
    console.log("Raw transactions from database:", transactions.map(t => ({
      id: t.id,
      date: t.date,
      type: t.type,
      amount: t.amount,
      description: t.description,
      category: t.category
    })))

    const mappedTransactions = transactions.map(t => ({
      id: t.id,
      name: t.description,
      type: t.type.toLowerCase() as "expense" | "income",
      account: t.accountType.toLowerCase() as "cash" | "bank" | "credit",
      category: t.category,
      amount: Number(t.amount),
      description: t.description,
      date: t.date.toISOString(),
      status: "Completed" as const,
    }))

    console.log("Mapped transactions:", mappedTransactions.map(t => ({
      id: t.id,
      date: t.date,
      type: t.type,
      amount: t.amount,
      month: `${new Date(t.date).getFullYear()}-${String(new Date(t.date).getMonth() + 1).padStart(2, '0')}`
    })))

    return { transactions: mappedTransactions }
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return { error: "Failed to fetch transactions" }
  }
}

export async function createTransaction(data: CreateTransactionInput) {
  try {
    console.log("Starting transaction creation with data:", data)
    
    const session = await auth()
    console.log("Auth Session:", {
      exists: !!session,
      userId: session?.user?.id,
    })
    
    if (!session?.user?.id) {
      console.log("No authenticated user found")
      return { error: "You must be logged in to create a transaction" }
    }

    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })
    console.log("Found business:", {
      exists: !!business,
      businessId: business?.id,
    })

    if (!business) {
      console.log("No business found for user")
      return { error: "You need to create a business profile first" }
    }

    console.log("Validating transaction data...")
    const validatedData = transactionSchema.parse(data)
    console.log("Validation successful:", validatedData)

    console.log("Creating transaction in database...")
    const transaction = await prisma.transaction.create({
      data: {
        description: validatedData.name,
        type: validatedData.type.toUpperCase(),
        accountType: validatedData.accountType.toUpperCase(),
        category: validatedData.category,
        amount: validatedData.amount,
        businessId: business.id,
        date: new Date(),
      },
    })
    console.log("Transaction created successfully:", transaction)

    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    
    return { 
      transaction: {
        id: transaction.id,
        name: transaction.description,
        type: transaction.type.toLowerCase() as TransactionType,
        account: transaction.accountType.toLowerCase() as AccountType,
        category: transaction.category,
        amount: Number(transaction.amount),
        description: transaction.description,
        date: transaction.date.toISOString(),
        status: "Completed" as const,
      }
    }
  } catch (error) {
    console.error("Failed to create transaction. Full error:", error)
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => e.message).join(", ")
      console.error("Validation errors:", errorMessage)
      return { error: `Invalid transaction data: ${errorMessage}` }
    }
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      return { error: `Failed to create transaction: ${error.message}` }
    }
    return { error: "Failed to create transaction" }
  }
}

export async function updateTransactionStatus(id: string, status: Transaction["status"]) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { business: true },
    })

    if (!transaction) {
      return { error: "Transaction not found" }
    }

    // Verify the transaction belongs to the user's business
    if (transaction.business.userId !== session.user.id) {
      return { error: "Unauthorized" }
    }

    // Since we don't store status in the database, we'll just verify the transaction exists
    const updatedTransaction: Transaction = {
      id: transaction.id,
      name: transaction.description || '',
      type: transaction.type.toLowerCase() as "expense" | "income",
      account: "bank", // Default since we don't store this
      category: transaction.category || "Other",
      amount: Number(transaction.amount),
      description: transaction.description || '',
      date: transaction.date.toISOString(),
      status,
    }

    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    return { transaction: updatedTransaction }
  } catch (error) {
    console.error("Failed to update transaction status:", error)
    return { error: "Failed to update transaction status" }
  }
}

export async function deleteTransaction(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { business: true },
    })

    if (!transaction) {
      return { error: "Transaction not found" }
    }

    // Verify the transaction belongs to the user's business
    if (transaction.business.userId !== session.user.id) {
      return { error: "Unauthorized" }
    }

    await prisma.transaction.delete({
      where: { id },
    })

    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete transaction:", error)
    return { error: "Failed to delete transaction" }
  }
}

export async function deleteTransactions(ids: string[]) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    // Get all transactions to verify ownership
    const transactions = await prisma.transaction.findMany({
      where: { id: { in: ids } },
      include: { business: true },
    })

    // Verify all transactions belong to the user's business
    const unauthorized = transactions.some(t => t.business.userId !== session.user.id)
    if (unauthorized) {
      return { error: "Unauthorized" }
    }

    await prisma.transaction.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete transactions:", error)
    return { error: "Failed to delete transactions" }
  }
}

export async function getFinancialMetrics() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const business = await prisma.business.findUnique({
      where: { userId: session.user.id },
      include: {
        financialPosition: true
      }
    })

    if (!business) {
      return { error: "Business not found" }
    }

    // Get current period transactions (current month)
    const now = new Date()
    const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const currentTransactions = await prisma.transaction.findMany({
      where: { 
        businessId: business.id,
        date: {
          gte: currentPeriodStart,
          lte: now
        }
      },
      select: {
        type: true,
        amount: true,
        category: true
      }
    })
    
    // Get previous period transactions (last month)
    const previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const previousPeriodEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    
    const previousTransactions = await prisma.transaction.findMany({
      where: { 
        businessId: business.id,
        date: {
          gte: previousPeriodStart,
          lte: previousPeriodEnd
        }
      },
      select: {
        type: true,
        amount: true
      }
    })

    // Calculate current period metrics
    const currentRevenue = currentTransactions
      .filter(t => t.type.toUpperCase() === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0)
    
    const currentExpenses = currentTransactions
      .filter(t => t.type.toUpperCase() === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    // Calculate previous period metrics
    const previousRevenue = previousTransactions
      .filter(t => t.type.toUpperCase() === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0)
    
    const previousExpenses = previousTransactions
      .filter(t => t.type.toUpperCase() === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    // Calculate growth rates
    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : currentRevenue > 0 ? 100 : 0

    const expenseGrowth = previousExpenses > 0 
      ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 
      : currentExpenses > 0 ? 100 : 0

    // Get financial position metrics
    const financialPosition = business.financialPosition || {
      currentAssets: 0,
      fixedAssets: 0,
      currentLiabilities: 0,
      longTermLiabilities: 0,
      commonStock: 0,
      retainedEarnings: 0
    }

    // Calculate operational metrics
    const operationalExpenses = currentTransactions
      .filter(t => t.type.toUpperCase() === "EXPENSE" && t.category !== "Capital Expenditure")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const cashFlow = currentRevenue - currentExpenses
    
    // Log the calculations for debugging
    console.log("Financial Metrics Calculation:", {
      currentPeriod: {
        start: currentPeriodStart,
        end: now,
        revenue: currentRevenue,
        expenses: currentExpenses,
        cashFlow
      },
      previousPeriod: {
        start: previousPeriodStart,
        end: previousPeriodEnd,
        revenue: previousRevenue,
        expenses: previousExpenses
      },
      growth: {
        revenue: revenueGrowth,
        expenses: expenseGrowth
      }
    })
    
    return { 
      metrics: {
        totalRevenue: currentRevenue,
        totalExpenses: currentExpenses,
        revenueGrowth,
        expenseGrowth,
        operationalExpenses,
        cashFlow,
        currentAssets: Number(financialPosition.currentAssets),
        fixedAssets: Number(financialPosition.fixedAssets),
        currentLiabilities: Number(financialPosition.currentLiabilities),
        longTermLiabilities: Number(financialPosition.longTermLiabilities),
        commonStock: Number(financialPosition.commonStock),
        retainedEarnings: Number(financialPosition.retainedEarnings)
      }
    }
  } catch (error) {
    console.error("Failed to calculate metrics:", error)
    return { error: "Failed to calculate metrics" }
  }
}

