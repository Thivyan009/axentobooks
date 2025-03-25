import { GoogleGenerativeAI } from "@google/generative-ai"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { format } from "date-fns"

// Initialize Gemini AI
console.log("Checking for GEMINI_API_KEY...")
console.log("Environment variables:", {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "Present" : "Missing",
  NODE_ENV: process.env.NODE_ENV
})

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables")
  throw new Error("GEMINI_API_KEY is not set in environment variables")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
console.log("Gemini AI initialized successfully")

interface TransactionAnalysis {
  type: "asset" | "liability" | "equity"
  category: string
  description: string
  isIncrease: boolean
  confidence: number
  impact: {
    asset?: {
      type: string
      value: number
      description: string
    }
    liability?: {
      type: string
      amount: number
      description: string
    }
    equity?: {
      type: string
      amount: number
      description: string
    }
  }
}

export async function analyzeTransaction(transaction: {
  date: Date
  type: string
  amount: number
  category: string
  description: string
}): Promise<TransactionAnalysis> {
  console.log("Starting transaction analysis with Gemini AI")
  console.log("Transaction details:", {
    date: transaction.date,
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description
  })

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.3,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  })

  const prompt = `As a financial analyst, analyze this transaction and determine its impact on the company's financial position.

Transaction Details:
Date: ${format(new Date(transaction.date), "yyyy-MM-dd")}
Type: ${transaction.type}
Amount: ${transaction.amount}
Category: ${transaction.category}
Description: ${transaction.description}

Analyze this transaction and provide:
1. The primary type (asset, liability, or equity)
2. A specific category name
3. Whether this increases or decreases the financial position
4. The exact impact on the respective financial statement
5. A confidence score (0-1)
6. A detailed explanation

Return a JSON object with this structure:
{
  "type": "asset" | "liability" | "equity",
  "category": "string",
  "description": "string",
  "isIncrease": boolean,
  "confidence": number,
  "impact": {
    "asset": {
      "type": "string",
      "value": number,
      "description": "string"
    },
    "liability": {
      "type": "string",
      "amount": number,
      "description": "string"
    },
    "equity": {
      "type": "string",
      "amount": number,
      "description": "string"
    }
  }
}

Only include the relevant impact section based on the transaction type.`

  try {
    console.log("Sending request to Gemini AI...")
    const result = await model.generateContent(prompt)
    console.log("Received response from Gemini AI")
    
    const response = await result.response
    const text = response.text()
    console.log("Raw response text:", text)
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("No JSON found in response:", text)
      throw new Error("Invalid response format")
    }

    const analysis = JSON.parse(jsonMatch[0]) as TransactionAnalysis
    console.log("Parsed analysis:", analysis)

    // Validate the response structure
    if (!analysis.type || !analysis.category || typeof analysis.confidence !== "number") {
      console.error("Invalid analysis structure:", analysis)
      throw new Error("Invalid analysis structure")
    }

    // Ensure confidence is between 0 and 1
    if (analysis.confidence < 0 || analysis.confidence > 1) {
      console.warn("Confidence value out of range, normalizing to 0-1:", analysis.confidence)
      analysis.confidence = Math.max(0, Math.min(1, analysis.confidence))
    }

    return analysis
  } catch (error) {
    console.error("Error analyzing transaction:", error)
    if (error instanceof Error) {
      console.error("Error stack trace:", error.stack)
    }
    // Return a default analysis instead of throwing
    return {
      type: "asset",
      category: "Uncategorized",
      description: "Failed to analyze transaction",
      isIncrease: false,
      confidence: 0,
      impact: {}
    }
  }
}

export async function updateFinancialStatements(
  businessId: string,
  transaction: {
    date: Date
    type: string
    amount: number
    category: string
    description: string
  },
  analysis: TransactionAnalysis
) {
  try {
    // Start a transaction to ensure all updates are atomic
    return await prisma.$transaction(async (tx) => {
      // Update Asset if applicable
      if (analysis.impact.asset) {
        await tx.asset.create({
          data: {
            name: analysis.impact.asset.description,
            type: analysis.impact.asset.type,
            value: analysis.impact.asset.value,
            purchaseDate: transaction.date,
            businessId,
          },
        })
      }

      // Update Liability if applicable
      if (analysis.impact.liability) {
        await tx.liability.create({
          data: {
            name: analysis.impact.liability.description,
            type: analysis.impact.liability.type,
            amount: analysis.impact.liability.amount,
            dueDate: transaction.date,
            businessId,
          },
        })
      }

      // Update Equity if applicable
      if (analysis.impact.equity) {
        await tx.equityDetail.create({
          data: {
            type: analysis.impact.equity.type,
            amount: analysis.impact.equity.amount,
            description: analysis.impact.equity.description,
            businessId,
          },
        })
      }

      // Update the transaction with AI analysis results
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          aiConfidence: analysis.confidence,
          notes: analysis.description,
        },
      })

      return { success: true }
    })
  } catch (error) {
    console.error("Error updating financial statements:", error)
    throw error
  }
} 