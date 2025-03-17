import { GoogleGenerativeAI } from "@google/generative-ai"
import type { NextRequest } from "next/server"
import { z } from "zod"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Validation schema for request
const requestSchema = z.object({
  transactions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(["expense", "income"]),
      amount: z.number(),
      category: z.string(),
      date: z.string(),
    }),
  ),
  startDate: z.string(),
  endDate: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const { transactions, startDate, endDate } = requestSchema.parse(json)

    // Create the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      }
    })

    // Prepare transaction data for analysis
    const transactionSummary = transactions
      .map(
        (t) => `
      Transaction:
      - Description: ${t.name}
      - Type: ${t.type}
      - Amount: $${t.amount.toFixed(2)}
      - Category: ${t.category}
      - Date: ${new Date(t.date).toLocaleDateString()}
    `,
      )
      .join("\n")

    // Create detailed prompt for the AI
    const prompt = `
      Act as an expert financial analyst. Analyze these transactions and generate a detailed profit and loss statement.
      
      Time Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}

      ${transactionSummary}

      Generate a comprehensive financial analysis including:
      1. Revenue breakdown by category
      2. Expense breakdown by category
      3. Detailed financial metrics
      4. Business insights and trends
      5. Strategic recommendations
      6. Risk assessment
      7. Growth opportunities

      Provide the analysis in this JSON format:
      {
        "periodStart": "date",
        "periodEnd": "date",
        "revenue": [
          {
            "category": "string",
            "amount": number,
            "items": [
              {
                "description": "string",
                "amount": number
              }
            ]
          }
        ],
        "expenses": [
          {
            "category": "string",
            "amount": number,
            "items": [
              {
                "description": "string",
                "amount": number
              }
            ]
          }
        ],
        "summary": {
          "totalRevenue": number,
          "totalExpenses": number,
          "netProfitLoss": number,
          "profitMargin": number,
          "monthOverMonthGrowth": number
        },
        "analysis": {
          "insights": ["string"],
          "recommendations": ["string"],
          "riskFactors": ["string"],
          "opportunities": ["string"]
        }
      }

      Important:
      - Categorize similar transactions together
      - Calculate accurate totals and percentages
      - Provide actionable insights
      - Identify specific growth opportunities
      - Highlight potential risks
      - Focus on business impact
    `

    // Generate content using Gemini AI
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract and parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid AI response format")
    }

    const parsedResponse = JSON.parse(jsonMatch[0])

    // Validate the response structure
    const validatedResponse = {
      ...parsedResponse,
      periodStart: startDate,
      periodEnd: endDate,
      summary: {
        ...parsedResponse.summary,
        totalRevenue: Number(parsedResponse.summary.totalRevenue.toFixed(2)),
        totalExpenses: Number(parsedResponse.summary.totalExpenses.toFixed(2)),
        netProfitLoss: Number(parsedResponse.summary.netProfitLoss.toFixed(2)),
        profitMargin: Number(parsedResponse.summary.profitMargin.toFixed(2)),
        monthOverMonthGrowth: Number(parsedResponse.summary.monthOverMonthGrowth.toFixed(2)),
      },
    }

    return Response.json(validatedResponse)
  } catch (error) {
    console.error("P&L Generation Error:", error)
    return Response.json({ error: "Failed to generate profit/loss statement" }, { status: 500 })
  }
}

