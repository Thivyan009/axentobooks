import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { writeFile } from "node:fs/promises"
import { join } from "node:path"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
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

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Generate a unique filename
    const fileName = `${uuidv4()}.pdf`
    const originalName = file.name

    // Create the statement in the database
    const statement = await prisma.bankStatement.create({
      data: {
        fileName,
        originalName,
        status: "pending",
        businessId: business.id,
        date: new Date(), // This will be updated when the statement is processed
        balance: 0, // This will be updated when the statement is processed
        currency: business.currency,
        accountId: "default", // This will be updated when the statement is processed
        statementNumber: `STMT-${Date.now()}`, // This will be updated when the statement is processed
      },
    })

    // Save the file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const path = join(process.cwd(), "uploads", fileName)
    await writeFile(path, buffer)

    // Update the status to completed after successful file upload
    const updatedStatement = await prisma.bankStatement.update({
      where: { id: statement.id },
      data: { status: "completed" },
    })

    return NextResponse.json({
      id: updatedStatement.id,
      fileName: updatedStatement.fileName,
      originalName: updatedStatement.originalName,
      status: updatedStatement.status,
      date: updatedStatement.date,
      balance: updatedStatement.balance,
      currency: updatedStatement.currency,
      accountId: updatedStatement.accountId,
      statementNumber: updatedStatement.statementNumber,
    })
  } catch (error) {
    console.error("Error uploading statement:", error)
    return NextResponse.json(
      { error: "Failed to upload statement" },
      { status: 500 }
    )
  }
} 