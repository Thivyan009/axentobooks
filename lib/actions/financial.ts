"use server"

import { prisma } from "@/lib/prisma"

export type FinancialData = {
  assets: {
    total: number
    items: Array<{
      id: string
      name: string
      type: string
      value: number
      purchaseDate: Date | null
    }>
  }
  liabilities: {
    total: number
    items: Array<{
      id: string
      name: string
      type: string
      amount: number
      dueDate: Date | null
    }>
  }
  equity: {
    total: number
    items: Array<{
      id: string
      type: string
      amount: number
      description: string | null
    }>
  }
}

export type FinancialMetrics = {
  totalRevenue: number
  totalExpenses: number
  cashFlow: number
  transactions: Array<{
    id: string
    type: string
    amount: number
    description: string | null
    date: Date
    category: string | null
  }>
}

export type SearchParams = {
  query?: string
  type?: 'INCOME' | 'EXPENSE' | null
  startDate?: Date
  endDate?: Date
}

export async function searchTransactions(businessId: string, params: SearchParams) {
  const { query, type, startDate, endDate } = params

  const where: any = {
    businessId,
  }

  // Add search conditions
  if (query) {
    where.OR = [
      { description: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } },
    ]
  }

  if (type) {
    where.type = type
  }

  if (startDate || endDate) {
    where.date = {}
    if (startDate) where.date.gte = startDate
    if (endDate) where.date.lte = endDate
  }

  const transactions = await prisma.transaction.findMany({
    where,
    select: {
      id: true,
      type: true,
      amount: true,
      description: true,
      date: true,
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  })

  // Calculate totals for filtered transactions
  const totalRevenue = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const cashFlow = totalRevenue - totalExpenses

  return {
    totalRevenue,
    totalExpenses,
    cashFlow,
    transactions,
  }
}

export async function getFinancialData(businessId: string): Promise<FinancialData> {
  try {
    // Fetch financial position
    const financialPosition = await prisma.financialPosition.findUnique({
      where: { businessId }
    })

    // Return default empty state if no financial position exists
    if (!financialPosition) {
      return {
        assets: {
          total: 0,
          items: []
        },
        liabilities: {
          total: 0,
          items: []
        },
        equity: {
          total: 0,
          items: []
        }
      }
    }

    // Transform the data to match the expected format
    return {
      assets: {
        total: financialPosition.totalAssets,
        items: [
          {
            id: 'current-assets',
            name: 'Current Assets',
            type: 'Current',
            value: financialPosition.currentAssets,
            purchaseDate: null
          },
          {
            id: 'fixed-assets',
            name: 'Fixed Assets',
            type: 'Fixed',
            value: financialPosition.fixedAssets,
            purchaseDate: null
          }
        ]
      },
      liabilities: {
        total: financialPosition.totalLiabilities,
        items: [
          {
            id: 'current-liabilities',
            name: 'Current Liabilities',
            type: 'Current',
            amount: financialPosition.currentLiabilities,
            dueDate: null
          },
          {
            id: 'long-term-liabilities',
            name: 'Long-term Liabilities',
            type: 'Long-term',
            amount: financialPosition.longTermLiabilities,
            dueDate: null
          }
        ]
      },
      equity: {
        total: financialPosition.totalEquity,
        items: [
          {
            id: 'common-stock',
            type: 'Common Stock',
            amount: financialPosition.commonStock,
            description: 'Issued capital'
          },
          {
            id: 'retained-earnings',
            type: 'Retained Earnings',
            amount: financialPosition.retainedEarnings,
            description: 'Accumulated profits'
          }
        ]
      }
    }
  } catch (error) {
    console.error('Error fetching financial data:', error)
    // Return default empty state in case of error
    return {
      assets: {
        total: 0,
        items: []
      },
      liabilities: {
        total: 0,
        items: []
      },
      equity: {
        total: 0,
        items: []
      }
    }
  }
}

export async function getFinancialMetrics(businessId: string): Promise<FinancialMetrics> {
  // Get current date and start of current month
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Fetch transactions for the current month
  const transactions = await prisma.transaction.findMany({
    where: {
      businessId,
      date: {
        gte: startOfMonth,
        lte: now,
      },
    },
    select: {
      id: true,
      type: true,
      amount: true,
      description: true,
      date: true,
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  })

  // Calculate metrics
  const totalRevenue = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const cashFlow = totalRevenue - totalExpenses

  return {
    totalRevenue,
    totalExpenses,
    cashFlow,
    transactions,
  }
}

export async function getBusinessIdByUserId(userId: string): Promise<string | null> {
  const business = await prisma.business.findUnique({
    where: { userId },
    select: { id: true }
  })
  
  return business?.id || null
} 