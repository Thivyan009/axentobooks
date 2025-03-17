import { GoogleGenerativeAI } from "@google/generative-ai"
import type { NextRequest } from "next/server"
import { z } from "zod"

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Validation schema
const requestSchema = z.object({
  description: z.string(),
  amount: z.number().optional(),
  category: z.string().optional(),
  type: z.enum(["expense", "income"]).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const { description, amount, category, type } = requestSchema.parse(json)

    // Create the model and start the chat
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      }
    })

    const prompt = `
      Act as a financial assistant. Analyze this transaction:
      Description: ${description}
      ${amount ? `Amount: ${amount}` : ""}
      ${category ? `Category: ${category}` : ""}
      ${type ? `Type: ${type}` : ""}

      Provide a JSON response with:
      1. Suggested amount (if not provided)
      2. Best category for this transaction
      3. A clear description
      4. Confidence score (0-1)
      5. Brief explanation of the analysis

      Format:
      {
        "amount": number,
        "category": string,
        "description": string,
        "confidence": number,
        "explanation": string
      }
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid response format")
    }

    const parsedResponse = JSON.parse(jsonMatch[0])

    return Response.json(parsedResponse)
  } catch (error) {
    console.error("Calculation error:", error)
    return Response.json({ error: "Failed to process calculation" }, { status: 500 })
  }
}

