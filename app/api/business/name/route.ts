import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Business name API - Start")
    const session = await getServerSession(authOptions)
    console.log("Business name API - Session:", session)

    if (!session?.user?.id) {
      console.log("Business name API - No session")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
      select: { name: true }
    })
    console.log("Business name API - Found business:", business)

    if (!business) {
      console.log("Business name API - No business found")
      return NextResponse.json({ name: null })
    }

    console.log("Business name API - Returning:", business.name)
    return NextResponse.json({ name: business.name })
  } catch (error) {
    console.error("Business name API - Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 