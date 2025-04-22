import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Maximum allowed value for financial amounts to prevent extreme values
const MAX_FINANCIAL_AMOUNT = 1000000000; // 1 billion

export async function GET() {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    console.log("Session:", session)

    if (!session?.user?.role) {
      console.log("No role found in session")
      return new NextResponse("Unauthorized: No role", { status: 401 })
    }

    if (session.user.role.toUpperCase() !== "SUPER_ADMIN") {
      console.log("Invalid role:", session.user.role)
      return new NextResponse("Unauthorized: Not super admin", { status: 401 })
    }

    // Get current date and date ranges
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    try {
      // Get current stats
      const [
        totalUsers,
        activeUsers,
        totalBusinesses,
        financialStats,
        previousMonthFinancials,
        previousMonthUsers,
        previousMonthBusinesses,
      ] = await Promise.all([
        // Total users
        prisma.user.count(),
        // Active users (logged in within last 24 hours)
        prisma.user.count({
          where: {
            lastLoginAt: {
              gte: twentyFourHoursAgo,
            },
            isActive: true,
          },
        }),
        // Total businesses
        prisma.business.count(),
        // Current financial stats
        prisma.transaction.groupBy({
          by: ['type'],
          _sum: {
            amount: true,
          },
          _count: true,
        }),
        // Previous month's financials
        prisma.transaction.groupBy({
          by: ['type'],
          _sum: {
            amount: true,
          },
          where: {
            createdAt: {
              lt: thirtyDaysAgo,
            },
          },
        }),
        // User count from 30 days ago
        prisma.user.count({
          where: {
            createdAt: {
              lt: thirtyDaysAgo,
            },
          },
        }),
        // Business count from 30 days ago
        prisma.business.count({
          where: {
            createdAt: {
              lt: thirtyDaysAgo,
            },
          },
        }),
      ])

      // Process financial data with validation
      const validateAmount = (amount: number | null | undefined): number => {
        if (amount === null || amount === undefined) return 0;
        // Cap the amount at MAX_FINANCIAL_AMOUNT to prevent extreme values
        return Math.min(Number(amount), MAX_FINANCIAL_AMOUNT);
      };

      const totalIncome = validateAmount(financialStats.find(stat => stat.type === 'INCOME')?._sum.amount);
      const totalExpenses = validateAmount(financialStats.find(stat => stat.type === 'EXPENSE')?._sum.amount);
      const incomeCount = financialStats.find(stat => stat.type === 'INCOME')?._count ?? 0;
      const expenseCount = financialStats.find(stat => stat.type === 'EXPENSE')?._count ?? 0;
      
      const previousIncome = validateAmount(previousMonthFinancials.find(stat => stat.type === 'INCOME')?._sum.amount);
      const previousExpenses = validateAmount(previousMonthFinancials.find(stat => stat.type === 'EXPENSE')?._sum.amount);

      // Calculate growth rates with validation
      const calculateGrowth = (current: number, previous: number): number => {
        if (previous === 0) return 0;
        const growth = ((current - previous) / previous) * 100;
        // Cap growth at 1000% to prevent extreme values
        return Math.min(Math.max(growth, -1000), 1000);
      };

      const userGrowth = calculateGrowth(totalUsers, previousMonthUsers);
      const businessGrowth = calculateGrowth(totalBusinesses, previousMonthBusinesses);
      const incomeGrowth = calculateGrowth(totalIncome, previousIncome);
      const expenseGrowth = calculateGrowth(totalExpenses, previousExpenses);

      const response = {
        totalUsers: Number(totalUsers),
        activeUsers: Number(activeUsers),
        totalBusinesses: Number(totalBusinesses),
        financials: {
          totalIncome: Number(totalIncome),
          totalExpenses: Number(totalExpenses),
          netRevenue: Number(totalIncome - totalExpenses),
          incomeCount: Number(incomeCount),
          expenseCount: Number(expenseCount),
          incomeGrowth: Number(incomeGrowth.toFixed(1)),
          expenseGrowth: Number(expenseGrowth.toFixed(1)),
        },
        userGrowth: Number(userGrowth.toFixed(1)),
        businessGrowth: Number(businessGrowth.toFixed(1)),
      }

      console.log("Response:", response)
      return NextResponse.json(response)
    } catch (dbError) {
      console.error("Database error:", dbError)
      return new NextResponse("Database Error", { status: 500 })
    }
  } catch (error) {
    console.error("[SUPER_ADMIN_STATS]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 