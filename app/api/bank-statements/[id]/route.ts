import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { readFile, unlink } from "node:fs/promises"
import { join } from "node:path"
import path from "node:path"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      )
    }

    // Check if the statement belongs to the business
    const statement = await prisma.bankStatement.findFirst({
      where: {
        fileName: params.id,
        businessId: business.id,
      },
    })

    if (!statement) {
      return NextResponse.json(
        { error: "Statement not found" },
        { status: 404 }
      )
    }

    // Read the file
    const filePath = path.join(process.cwd(), "uploads", statement.fileName)
    const file = await readFile(filePath)

    // Return the file with appropriate headers
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${statement.originalName}"`,
      },
    })
  } catch (error) {
    console.error("Failed to download bank statement:", error)
    return NextResponse.json(
      { error: "Failed to download bank statement" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      )
    }

    // Check if the statement belongs to the business
    const statement = await prisma.bankStatement.findFirst({
      where: {
        fileName: params.id,
        businessId: business.id,
      },
    })

    if (!statement) {
      return NextResponse.json(
        { error: "Statement not found" },
        { status: 404 }
      )
    }

    // Delete the file
    const filePath = path.join(process.cwd(), "uploads", statement.fileName)
    await unlink(filePath)

    // Delete the statement from the database
    await prisma.bankStatement.delete({
      where: { fileName: statement.fileName },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete bank statement:", error)
    return NextResponse.json(
      { error: "Failed to delete bank statement" },
      { status: 500 }
    )
  }
} 