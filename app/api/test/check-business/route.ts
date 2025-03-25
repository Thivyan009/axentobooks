import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    console.log('Starting check-business request...'); // Debug log

    // Check authentication
    console.log('Attempting to get session...'); // Debug log
    const session = await auth()
    console.log('Session result:', JSON.stringify(session, null, 2)); // Debug log

    if (!session?.user?.id) {
      console.log('No valid session found - session:', JSON.stringify(session, null, 2)); // Debug log
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log('User ID from session:', session.user.id); // Debug log

    // Get the business for the current user
    console.log('Attempting to find business for user:', session.user.id); // Debug log
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

    console.log('Business query result:', JSON.stringify(business, null, 2)); // Debug log

    if (!business) {
      console.log('No business found for user:', session.user.id); // Debug log
      return NextResponse.json(
        { error: "No business found for user" },
        { status: 404 }
      )
    }

    const response = {
      business: {
        id: business.id,
        name: business.name,
        industry: business.industry,
        transactionCount: business._count.transactions,
      },
    };
    console.log('Sending response:', JSON.stringify(response, null, 2)); // Debug log
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error checking business - Full error:", error); // Debug log
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace'); // Debug log
    
    // Return more detailed error information in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          error: "Failed to check business",
          details: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined
        },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to check business" },
      { status: 500 }
    )
  }
} 