import { auth } from "@/lib/auth"
import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server"

export const maxDuration = 10 // Set max duration to 10 seconds
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof Blob)) {
      console.error("No file received or invalid file type")
      return NextResponse.json(
        { error: "No file received or invalid file type" },
        { status: 400 }
      )
    }

    console.log("Processing upload for user:", session.user.id)
    console.log("File details:", {
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)}KB`
    })

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type)
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPG, PNG, or GIF file." },
        { status: 400 }
      )
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      console.error("File too large:", file.size)
      return NextResponse.json(
        { error: "File too large. Please upload an image less than 2MB." },
        { status: 400 }
      )
    }

    try {
      // Convert file to base64
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`

      console.log("Base64 image length:", base64Image.length)

      // Update user's profile image in database
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { image: base64Image }
      })

      if (!updatedUser) {
        throw new Error("Failed to update user profile")
      }

      return NextResponse.json({ image: base64Image })
    } catch (error) {
      console.error("Error processing image:", error)
      return NextResponse.json(
        { error: "Failed to process image" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing profile image:", error)
    return NextResponse.json(
      { error: "Failed to remove profile image" },
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false, // Required for handling FormData
    responseLimit: '4mb', // Increase the response size limit
  },
} 