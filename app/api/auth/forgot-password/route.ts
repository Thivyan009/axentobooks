import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "node:crypto"
import nodemailer from "nodemailer"

// Validate environment variables
const requiredEnvVars = {
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
}

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`${key} must be set in environment variables`)
  }
})

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Log the start of the process
    console.log(`[Forgot Password] Processing request for email: ${email}`)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log(`[Forgot Password] No user found with email: ${email}`)
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link",
      })
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    console.log(`[Forgot Password] Generated reset token for user: ${user.id}`)

    try {
      // Save reset token to database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      })
      console.log(`[Forgot Password] Saved reset token to database for user: ${user.id}`)
    } catch (dbError) {
      console.error("[Forgot Password] Database error:", dbError)
      throw new Error("Failed to save reset token")
    }

    // Create reset URL
    const baseUrl = process.env.NEXTAUTH_URL!.replace(/\/$/, "")
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`

    // Prepare email content
    const emailContent = {
      from: {
        name: "Axento Books",
        address: process.env.SMTP_USER!,
      },
      to: {
        name: user.name,
        address: user.email,
      },
      subject: "Reset Your Password - Axento Books",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Reset Your Password</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; text-align: center;">
                <h1 style="margin: 0; color: #333;">Reset Your Password</h1>
              </div>
              <div style="padding: 20px; background-color: white; border-radius: 5px; margin-top: 20px;">
                <p>Hello ${user.name},</p>
                <p>You recently requested to reset your password for your Axento Books account. Click the button below to reset it:</p>
                <p style="text-align: center;">
                  <a href="${resetUrl}" 
                     style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: 500;">
                    Reset Password
                  </a>
                </p>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #0070f3;">${resetUrl}</p>
                <p>This link will expire in 1 hour for security reasons.</p>
                <p>If you didn't request this reset, please ignore this email or contact support if you have concerns.</p>
              </div>
              <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                <p>This is an automated email from Axento Books. Please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    try {
      // Verify SMTP connection before sending
      await transporter.verify()
      console.log("[Forgot Password] SMTP connection verified")

      // Send email
      const info = await transporter.sendMail(emailContent)
      console.log("[Forgot Password] Email sent successfully:", {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected,
      })

      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link",
      })
    } catch (emailError: any) {
      console.error("[Forgot Password] Email error:", {
        error: emailError.message,
        code: emailError.code,
        command: emailError.command,
        response: emailError.response,
      })

      // Check for specific Gmail errors
      if (emailError.code === 'EAUTH') {
        console.error("[Forgot Password] Authentication error. Please check Gmail App Password")
        throw new Error("Email authentication failed. Please check SMTP credentials.")
      }

      throw new Error("Failed to send password reset email")
    }
  } catch (error) {
    console.error("[Forgot Password] General error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
} 