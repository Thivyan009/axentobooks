import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = resetPasswordSchema.parse(json)

    const user = await prisma.user.findFirst({
      where: {
        resetToken: body.token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return new NextResponse("Invalid or expired reset token", { status: 400 })
    }

    const hashedPassword = await hash(body.password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return new NextResponse("Password reset successful", { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.errors[0].message, { status: 422 })
    }

    return new NextResponse("Something went wrong", { status: 500 })
  }
} 