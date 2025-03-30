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

    // Check if business already exists
    const existingBusiness = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (existingBusiness) {
      return NextResponse.json({
        message: "Business already exists",
        business: {
          id: existingBusiness.id,
          name: existingBusiness.name,
          industry: existingBusiness.industry,
        },
      })
    }

    // Create new business
    const business = await prisma.business.create({
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

    return NextResponse.json({
      message: "Business created successfully",
      business: {
        id: business.id,
        name: business.name,
        industry: business.industry,
      },
    })
  } catch (error) {
    console.error("Error creating business:", error)
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    )
  }
} 