import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get the business for the current user
    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    })

    if (!business) {
      return NextResponse.json(
        { error: "No business found for user" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      business: {
        id: business.id,
        name: business.name,
        industry: business.industry,
        transactionCount: business._count.transactions,
      },
    })
  } catch (error) {
    console.error("Error checking business:", error)
    return NextResponse.json(
      { error: "Failed to check business" },
      { status: 500 }
    )
  }
} 