import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
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

    // Get the business ID for the current user
    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      )
    }

    // Generate test transactions for the last 60 days
    const transactions = []
    const now = new Date()
    
    for (let i = 0; i < 60; i++) {
      const date = new Date()
      date.setDate(now.getDate() - i)
      
      // Add income transaction
      transactions.push({
        businessId: business.id,
        date,
        amount: Math.random() * 1000 + 500, // Random amount between 500 and 1500
        type: "income",
        category: "sales",
        description: "Product sales",
        status: "completed",
      })

      // Add expense transaction
      transactions.push({
        businessId: business.id,
        date,
        amount: -(Math.random() * 500 + 200), // Random amount between -200 and -700
        type: "expense",
        category: "operations",
        description: "Operating expenses",
        status: "completed",
      })
    }

    // Add transactions to database
    await prisma.transaction.createMany({
      data: transactions,
    })

    return NextResponse.json({
      message: "Test transactions added successfully",
      count: transactions.length,
    })
  } catch (error) {
    console.error("Error adding test transactions:", error)
    return NextResponse.json(
      { error: "Failed to add test transactions" },
      { status: 500 }
    )
  }
} 