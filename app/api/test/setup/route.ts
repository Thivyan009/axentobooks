import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth"

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get or create business
    let business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (!business) {
      business = await prisma.business.create({
        data: {
          name: "Test Business",
          industry: "Technology",
          userId: session.user.id,
        },
      })

      // Create initial financial position
      await prisma.financialPosition.create({
        data: {
          businessId: business.id,
          currentAssets: 10000,
          fixedAssets: 50000,
          currentLiabilities: 5000,
          longTermLiabilities: 20000,
          commonStock: 25000,
          retainedEarnings: 10000,
          totalAssets: 60000,
          totalLiabilities: 25000,
          totalEquity: 35000,
          netWorth: 35000,
        },
      })
    }

    // Generate test transactions for the last 60 days
    const transactions = []
    const now = new Date()
    
    // Delete existing transactions
    await prisma.transaction.deleteMany({
      where: { businessId: business.id },
    })
    
    for (let i = 0; i < 60; i++) {
      const date = new Date()
      date.setDate(now.getDate() - i)
      
      // Add income transaction with increasing trend
      const baseIncome = 1000 + (i * 10) // Base income increases by 10 each day back
      const randomIncome = Math.random() * 500 // Random variation
      transactions.push({
        businessId: business.id,
        date,
        amount: baseIncome + randomIncome,
        type: "income",
        category: "sales",
        description: "Product sales",
        status: "completed",
        accountType: "revenue",
      })

      // Add expense transaction with slower increasing trend
      const baseExpense = 500 + (i * 5) // Base expense increases by 5 each day back
      const randomExpense = Math.random() * 200 // Random variation
      transactions.push({
        businessId: business.id,
        date,
        amount: -(baseExpense + randomExpense),
        type: "expense",
        category: "operations",
        description: "Operating expenses",
        status: "completed",
        accountType: "expense",
      })
    }

    // Add transactions to database
    await prisma.transaction.createMany({
      data: transactions,
    })

    return NextResponse.json({
      message: "Test data setup completed successfully",
      business: {
        id: business.id,
        name: business.name,
        industry: business.industry,
      },
      transactionCount: transactions.length,
    })
  } catch (error) {
    console.error("Error setting up test data:", error)
    return NextResponse.json(
      { error: "Failed to set up test data" },
      { status: 500 }
    )
  }
} 