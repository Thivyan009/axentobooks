"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { writeFile, readFile } from "node:fs/promises"
import { join } from "node:path"
import { v4 as uuidv4 } from "uuid"
import { parse } from "csv-parse/sync"
import { QueryClient } from "@tanstack/react-query"

interface Transaction {
  date: string
  name: string
  description: string
  amount: string
  category: string
  type: string
  paymentMethod: string
  account: string
  notes?: string
}

const VALID_PAYMENT_METHODS = ['cash', 'bank transfer', 'check', 'credit card', 'debit card']
const VALID_ACCOUNTS = ['Bank', 'Cash', 'Credit']

export async function processBankStatement(file: File) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (!business) {
      return { error: "Business not found" }
    }

    // Generate unique file name and statement number
    const fileName = `${uuidv4()}.csv`
    const statementNumber = `ST-${Date.now()}`

    // Create bank statement record first
    const bankStatement = await prisma.bankStatement.create({
      data: {
        fileName,
        originalName: file.name,
        status: "processing",
        date: new Date(), // Will be updated with actual statement date
        balance: 0, // Will be updated after processing transactions
        currency: business.currency,
        accountId: "default", // Default account ID
        statementNumber,
        businessId: business.id
      }
    })

    // Read and parse CSV file
    const fileContent = await file.text()
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as Array<{
      date: string
      name: string
      description: string
      amount: string
      category: string
      type: string
      accountType?: string
      account?: string
      paymentMethod?: string
    }>

    // Validate required columns with fallbacks
    const requiredColumns = ['date', 'name', 'description', 'amount', 'category', 'type']
    const headers = Object.keys(records[0] || {})
    const missingColumns = requiredColumns.filter(col => !headers.includes(col))

    if (missingColumns.length > 0) {
      // Update bank statement status to failed
      await prisma.bankStatement.update({
        where: { id: bankStatement.id },
        data: { status: "failed" }
      })
      return { error: `Missing required columns: ${missingColumns.join(", ")}` }
    }

    // Create transactions in batches
    const batchSize = 100
    const transactions = []
    let totalBalance = 0
    let statementDate = new Date()

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      const batchTransactions = await Promise.all(
        batch.map(async (record) => {
          const amount = Number.parseFloat(record.amount)
          if (Number.isNaN(amount)) {
            throw new Error(`Invalid amount in row ${i + 1}: ${record.amount}`)
          }

          // Determine account type with fallbacks
          let accountType = record.accountType || record.account || 'cash'
          accountType = accountType.toLowerCase()

          // Validate account type
          if (!['cash', 'bank', 'credit'].includes(accountType)) {
            throw new Error(`Invalid account type in row ${i + 1}: ${accountType}. Must be one of: cash, bank, credit`)
          }

          // Update total balance
          totalBalance += record.type.toLowerCase() === 'income' ? amount : -amount

          // Use the first transaction's date as the statement date
          if (i === 0) {
            statementDate = new Date(record.date)
          }

          return prisma.transaction.create({
            data: {
              description: record.name,
              type: record.type.toUpperCase(),
              accountType: accountType.toUpperCase(),
              category: record.category,
              amount: Math.abs(amount),
              businessId: business.id,
              date: new Date(record.date),
              bankStatementId: fileName, // Link to bank statement
            },
          })
        })
      )
      transactions.push(...batchTransactions)
    }

    // Update bank statement with final details
    await prisma.bankStatement.update({
      where: { id: bankStatement.id },
      data: {
        status: "completed",
        balance: totalBalance,
        date: statementDate
      }
    })

    // Revalidate all relevant paths to trigger UI updates
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/analytics")
    revalidatePath("/reports")

    // Force a revalidation of the transactions query
    const queryClient = new QueryClient()
    await queryClient.invalidateQueries({ queryKey: ["transactions"] })

    return { 
      success: true,
      message: `Successfully processed ${transactions.length} transactions`,
      transactions: transactions.map(t => ({
        id: t.id,
        name: t.description,
        type: t.type.toLowerCase() as "expense" | "income",
        account: t.accountType.toLowerCase() as "cash" | "bank" | "credit",
        category: t.category,
        amount: Number(t.amount),
        description: t.description,
        date: t.date.toISOString(),
        status: "Completed" as const,
      })),
      bankStatement: {
        id: bankStatement.id,
        fileName: bankStatement.fileName,
        originalName: bankStatement.originalName,
        status: bankStatement.status,
        date: bankStatement.date,
        balance: bankStatement.balance,
        currency: bankStatement.currency,
        accountId: bankStatement.accountId,
        statementNumber: bankStatement.statementNumber,
        createdAt: bankStatement.createdAt
      }
    }
  } catch (error) {
    console.error("Failed to process bank statement:", error)
    
    // If we have a bank statement ID, update its status to failed
    if (error instanceof Error && 'bankStatementId' in error) {
      try {
        await prisma.bankStatement.update({
          where: { id: (error as any).bankStatementId },
          data: { status: "failed" }
        })
      } catch (updateError) {
        console.error("Failed to update bank statement status:", updateError)
      }
    }
    
    return { error: error instanceof Error ? error.message : "Failed to process bank statement" }
  }
}

