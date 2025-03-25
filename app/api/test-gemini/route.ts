import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function GET() {
  try {
    // Log API key status (without exposing the key)
    console.log("Gemini API Key status:", process.env.GEMINI_API_KEY ? "Present" : "Missing")

    // Create a simple test prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const prompt = "Hello! This is a test message. Please respond with 'API is working!'"

    console.log("Sending test request to Gemini API...")
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    console.log("Received response from Gemini API")

    return NextResponse.json({ 
      success: true, 
      message: "Gemini API is working",
      response: text 
    })
  } catch (error) {
    console.error("Gemini API Test Error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to test Gemini API" 
      },
      { status: 500 }
    )
  }
} 