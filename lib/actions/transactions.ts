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
      amount: t.type.toLowerCase() === "expense" ? -Number(t.amount) : Number(t.amount),
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

export async function getFinancialMetrics(): Promise<{ metrics: FinancialMetrics; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { metrics: {} as FinancialMetrics, error: "Not authenticated" }
    }

    // Get business ID from user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { business: true },
    })

    if (!user?.business?.id) {
      return { metrics: {} as FinancialMetrics, error: "Business not found" }
    }

    // Get current date range
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Get previous month's date range
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get current month transactions
    const currentMonthTransactions = await prisma.transaction.findMany({
      where: {
        businessId: user.business.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        amount: true,
        type: true,
      },
    })

    // Get previous month transactions
    const prevMonthTransactions = await prisma.transaction.findMany({
      where: {
        businessId: user.business.id,
        date: {
          gte: startOfPrevMonth,
          lte: endOfPrevMonth,
        },
      },
      select: {
        amount: true,
        type: true,
      },
    })

    // Calculate current month metrics
    const currentRevenue = currentMonthTransactions
      .filter(t => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const currentExpenses = currentMonthTransactions
      .filter(t => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const currentCashFlow = currentRevenue - currentExpenses

    // Calculate previous month metrics
    const prevRevenue = prevMonthTransactions
      .filter(t => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const prevExpenses = prevMonthTransactions
      .filter(t => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    // Calculate growth percentages
    const revenueGrowth = prevRevenue > 0 
      ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 
      : 0

    const expenseGrowth = prevExpenses > 0 
      ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 
      : 0

    // Calculate profit margin
    const profitMargin = currentRevenue > 0 
      ? (currentCashFlow / currentRevenue) * 100 
      : 0

    // Calculate expense ratio
    const expenseRatio = currentRevenue > 0 
      ? (currentExpenses / currentRevenue) * 100 
      : 0

    // Calculate average transaction value
    const avgTransactionValue = currentMonthTransactions.length > 0
      ? currentMonthTransactions.reduce((sum, t) => sum + Number(t.amount), 0) / currentMonthTransactions.length
      : 0

    // Calculate transaction frequency
    const daysInMonth = endOfMonth.getDate()
    const transactionFrequency = currentMonthTransactions.length / daysInMonth

    // Calculate cash flow trend
    const cashFlowTrend = currentCashFlow > 0 ? "positive" : "negative"

    // Calculate financial health score (0-100)
    const healthScore = Math.min(100, Math.max(0,
      (profitMargin * 0.4) + // 40% weight on profit margin
      ((100 - expenseRatio) * 0.3) + // 30% weight on expense ratio
      (Math.min(transactionFrequency * 10, 30)) // 30% weight on transaction frequency
    ))

    return {
      metrics: {
        totalRevenue: currentRevenue,
        totalExpenses: currentExpenses,
        cashFlow: currentCashFlow,
        revenueGrowth,
        expenseGrowth,
        profitMargin,
        expenseRatio,
        avgTransactionValue,
        transactionFrequency,
        cashFlowTrend,
        healthScore,
        periodStart: startOfMonth,
        periodEnd: endOfMonth,
      },
    }
  } catch (error) {
    console.error("Error getting financial metrics:", error)
    return { 
      metrics: {} as FinancialMetrics, 
      error: error instanceof Error ? error.message : "Failed to get financial metrics" 
    }
  }
}

export async function getTransactionById(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const business = await prisma.business.findUnique({
      where: { userId: session.user.id },
    })

    if (!business) {
      return { error: "Business not found" }
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        businessId: business.id,
      },
    })

    if (!transaction) {
      return { error: "Transaction not found" }
    }

    return {
      transaction: {
        id: transaction.id,
        name: transaction.description,
        type: transaction.type.toLowerCase() as "expense" | "income",
        account: transaction.accountType.toLowerCase() as "cash" | "bank" | "credit",
        category: transaction.category,
        amount: Number(transaction.amount),
        description: transaction.description,
        date: transaction.date.toISOString(),
        status: "Completed" as const,
      }
    }
  } catch (error) {
    console.error("Failed to get transaction:", error)
    return { error: "Failed to get transaction" }
  }
}

export async function updateTransaction(data: {
  id: string
  description: string
  amount: number
  type: string
  category: string
  account: string
  date: Date
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const business = await prisma.business.findUnique({
      where: { userId: session.user.id },
    })

    if (!business) {
      return { error: "Business not found" }
    }

    // Verify transaction belongs to business
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: data.id,
        businessId: business.id,
      },
    })

    if (!existingTransaction) {
      return { error: "Transaction not found" }
    }

    const transaction = await prisma.transaction.update({
      where: {
        id: data.id,
      },
      data: {
        description: data.description,
        amount: data.amount,
        type: data.type.toUpperCase(),
        category: data.category,
        accountType: data.account.toUpperCase(),
        date: data.date,
      },
    })

    revalidatePath("/transactions")
    revalidatePath("/dashboard")

    return {
      transaction: {
        id: transaction.id,
        name: transaction.description,
        type: transaction.type.toLowerCase() as "expense" | "income",
        account: transaction.accountType.toLowerCase() as "cash" | "bank" | "credit",
        category: transaction.category,
        amount: Number(transaction.amount),
        description: transaction.description,
        date: transaction.date.toISOString(),
        status: "Completed" as const,
      }
    }
  } catch (error) {
    console.error("Failed to update transaction:", error)
    return { error: "Failed to update transaction" }
  }
}

