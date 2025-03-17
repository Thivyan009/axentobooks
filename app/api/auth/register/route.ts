import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { z } from "zod"

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  currency: z.string().min(3, "Currency code must be 3 characters").max(3),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Received registration request:", { ...body, password: "[REDACTED]" })

    const validation = RegisterSchema.safeParse(body)
    if (!validation.success) {
      console.log("Validation failed:", validation.error.errors)
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { name, email, password, businessName, currency } = validation.data

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Create user and business
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const result = await prisma.$transaction(async (tx) => {
      // Create user first
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          settings: {
            create: {
              theme: "light",
              emailNotifications: true
            }
          }
        }
      })

      // Then create business with the user's ID
      const business = await tx.business.create({
        data: {
          name: businessName,
          industry: "Other",
          currency,
          userId: user.id
        }
      })

      return { user, business }
    })

    console.log("User and business created successfully:", { 
      userId: result.user.id, 
      email: result.user.email,
      businessId: result.business.id 
    })

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      isNewUser: true,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        businessName: result.business.name
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Registration error:", error)
    
    // Return more specific error messages in development
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ 
        error: "Registration failed",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      error: "Failed to register user. Please try again later." 
    }, { status: 500 })
  }
} 