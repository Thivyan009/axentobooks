import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// Log the API key status (without exposing the key)
console.log("Gemini API Key status:", process.env.GEMINI_API_KEY ? "Present" : "Missing")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      console.error("Chat API: Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    let message: string
    let history: ChatMessage[]
    try {
      const body = await req.json()
      console.log("Chat API: Received request body:", {
        messagePresent: !!body.message,
        historyLength: body.history?.length
      })
      
      message = body.message
      history = body.history || []

      if (!message) {
        throw new Error("Message is required")
      }
    } catch (error) {
      console.error("Chat API: Invalid request body", error)
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      )
    }

    // Fetch business and financial data
    const business = await db.business.findFirst({
      where: { userId: session.user.id },
      include: {
        financialGoals: true,
        transactions: {
          orderBy: { date: 'desc' },
          take: 100 // Get last 100 transactions
        },
        bankStatements: {
          orderBy: { date: 'desc' },
          take: 12 // Get last 12 months of statements
        },
        financialPosition: true,
        assets: {
          orderBy: { createdAt: 'desc' }
        },
        liabilities: {
          orderBy: { createdAt: 'desc' }
        },
        equityDetails: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: "Please complete your business profile first" },
        { status: 404 }
      )
    }

    // Calculate financial metrics
    const assets = business.assets.reduce((sum, a) => sum + a.value, 0)
    const liabilities = business.liabilities.reduce((sum, l) => sum + l.amount, 0)
    const equity = business.equityDetails.reduce((sum, e) => sum + e.amount, 0)

    // Get current financial position
    const financialPosition = business.financialPosition || {
      currentAssets: 0,
      fixedAssets: 0,
      currentLiabilities: 0,
      longTermLiabilities: 0,
      totalAssets: assets,
      totalLiabilities: liabilities,
      totalEquity: equity,
      netWorth: assets - liabilities
    }

    // Prepare financial context
    const financialContext = {
      businessName: business.name,
      industry: business.industry,
      currency: business.currency,
      goals: business.financialGoals.map(g => ({
        title: g.title,
        target: g.targetAmount,
        current: g.currentAmount,
        deadline: g.deadline,
        status: g.status
      })),
      financialMetrics: {
        assets: {
          total: financialPosition.totalAssets,
          current: financialPosition.currentAssets,
          fixed: financialPosition.fixedAssets,
          breakdown: business.assets.map(a => ({
            name: a.name,
            type: a.type,
            value: a.value,
            purchaseDate: a.purchaseDate
          }))
        },
        liabilities: {
          total: financialPosition.totalLiabilities,
          current: financialPosition.currentLiabilities,
          longTerm: financialPosition.longTermLiabilities,
          breakdown: business.liabilities.map(l => ({
            name: l.name,
            type: l.type,
            amount: l.amount,
            dueDate: l.dueDate
          }))
        },
        equity: {
          total: financialPosition.totalEquity,
          breakdown: business.equityDetails.map(e => ({
            type: e.type,
            amount: e.amount,
            description: e.description
          }))
        },
        recentTransactions: business.transactions.map(t => ({
          date: t.date,
          type: t.type,
          category: t.category,
          amount: t.amount,
          description: t.description
        })),
        bankStatements: business.bankStatements.map(s => ({
          date: s.date,
          balance: s.balance,
          currency: s.currency
        }))
      }
    }

    // Format chat history for Gemini
    const formattedHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: msg.content,
    }))

    console.log("Chat API: Starting chat with history length:", history.length)

    try {
      // Initialize the chat with Gemini 2.0 Flash
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      console.log("Chat API: Model initialized with Gemini 2.0 Flash")

      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
      })
      console.log("Chat API: Chat started")

      // Send message with financial context
      const contextualizedMessage = `
Financial Context:
${JSON.stringify(financialContext, null, 2)}

User Question:
${message}
`

      // Send message and get response
      console.log("Chat API: Sending message to Gemini:", { messageLength: contextualizedMessage.length })
      const result = await chat.sendMessage(contextualizedMessage)
      console.log("Chat API: Message sent, waiting for response")
      
      const response = await result.response
      console.log("Chat API: Response received")
      
      const text = response.text()
      console.log("Chat API: Successfully processed response")

      return NextResponse.json({ response: text })
    } catch (error) {
      console.error("Chat API: Gemini API Error:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      })
      throw error // Re-throw to be caught by outer catch block
    }
  } catch (error) {
    console.error("Chat API Error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `AI Error: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    )
  }
} 