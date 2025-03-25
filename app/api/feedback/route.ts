import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"

const feedbackSchema = z.object({
  type: z.enum(["bug", "feature", "improvement", "other"]),
  title: z.string().min(5),
  description: z.string().min(10),
  email: z.string().email(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = feedbackSchema.parse(body)

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "thivyan@astacodelabs.com",
      subject: `[Beta Feedback] ${validatedData.type.toUpperCase()}: ${validatedData.title}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>Type:</strong> ${validatedData.type}</p>
        <p><strong>From:</strong> ${validatedData.email}</p>
        <p><strong>Title:</strong> ${validatedData.title}</p>
        <h3>Description:</h3>
        <p>${validatedData.description.replace(/\n/g, "<br>")}</p>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: "Feedback submitted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Feedback submission error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid feedback data", errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Failed to submit feedback" },
      { status: 500 }
    )
  }
} 