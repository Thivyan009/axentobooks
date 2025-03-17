import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
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
    const date = formData.get("date") as string
    const balance = Number.parseFloat(formData.get("balance") as string)
    const currency = formData.get("currency") as string
    const accountId = formData.get("accountId") as string
    const statementNumber = formData.get("statementNumber") as string

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    if (!date || !balance || !currency || !accountId || !statementNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Generate a unique ID for the statement
    const id = uuidv4()

    // Create the statement in the database
    const statement = await prisma.bankStatement.create({
      data: {
        id,
        businessId: business.id,
        date: new Date(date),
        balance,
        currency,
        accountId,
        statementNumber,
      },
    })

    // Save the file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const path = join(process.cwd(), "uploads", id)
    await writeFile(path, buffer)

    return NextResponse.json({ id: statement.id })
  } catch (error) {
    console.error("Error uploading bank statement:", error)
    return NextResponse.json(
      { error: "Failed to upload bank statement" },
      { status: 500 }
    )
  }
}