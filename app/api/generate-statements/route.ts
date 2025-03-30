import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { readFile } from "node:fs/promises"
import path from "path"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { month } = await req.json()

    // Get the business for the current user
    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // Get transactions for the selected month
    const startDate = new Date(month)
    const endDate = new Date(month)
    endDate.setMonth(endDate.getMonth() + 1)
    endDate.setDate(endDate.getDate() - 1)

    // Get all transactions (both manual and bank statement)
    const manualTransactions = await prisma.transaction.findMany({
      where: {
        businessId: business.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    const bankStatementTransactions = await prisma.bankStatementTransaction.findMany({
      where: {
        businessId: business.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    // Get bank statements for the selected month
    const bankStatements = await prisma.bankStatement.findMany({
      where: {
        businessId: business.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    // Read the bank statement file
    let bankStatementContent = ""
    if (bankStatements.length > 0) {
      const latestStatement = bankStatements[bankStatements.length - 1]
      const filePath = path.join(process.cwd(), "uploads", latestStatement.fileName)
      try {
        bankStatementContent = await readFile(filePath, "utf-8")
      } catch (error) {
        console.error("Error reading bank statement file:", error)
      }
    }

    // Combine and deduplicate transactions
    const allTransactions = [...manualTransactions, ...bankStatementTransactions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate opening and closing balances from bank statements
    const openingBalance = bankStatements[0]?.balance || 0
    const closingBalance = bankStatements[bankStatements.length - 1]?.balance || 0

    // Prepare the prompt for Gemini AI
    const prompt = `
      Generate financial statements for ${month} based on the following data:

      Manual Transactions:
      ${JSON.stringify(manualTransactions, null, 2)}

      Bank Statement Transactions:
      ${JSON.stringify(bankStatementTransactions, null, 2)}

      Bank Statements:
      ${JSON.stringify(bankStatements, null, 2)}

      Bank Statement Content:
      ${bankStatementContent}

      Opening Balance: ${openingBalance}
      Closing Balance: ${closingBalance}

      Please generate:
      1. A detailed Profit & Loss Statement including:
         - Revenue breakdown by category (combine both manual and bank transactions)
         - Expense breakdown by category (combine both manual and bank transactions)
         - Net Income
         - Key financial ratios (gross margin, operating margin, net margin)
         - Month-over-month growth
         - Reconciliation with bank statements
      
      2. A Balance Sheet including:
         - Current Assets (including bank balances from bank statements)
         - Fixed Assets
         - Current Liabilities
         - Long-term Liabilities
         - Equity
         - Key financial ratios (current ratio, debt-to-equity)
         - Bank statement reconciliation

      Important:
      - Use the bank statement transactions as the source of truth for cash transactions
      - Include all transactions from both manual entries and bank statements
      - Ensure the bank balances match the closing balance from bank statements
      - Reconcile any differences between manual transactions and bank statement transactions
      - Calculate the net income based on all transactions, not just manual entries
      - Use the actual bank statement content to verify and validate all transactions
      - Cross-reference the bank statement content with the extracted transactions to ensure accuracy

      Format the response as JSON with the following structure:
      {
        "profitLoss": {
          "revenue": [
            {
              "category": "string",
              "amount": number,
              "items": [{ "description": "string", "amount": number }]
            }
          ],
          "expenses": [
            {
              "category": "string",
              "amount": number,
              "items": [{ "description": "string", "amount": number }]
            }
          ],
          "summary": {
            "totalRevenue": number,
            "totalExpenses": number,
            "netIncome": number,
            "grossMargin": number,
            "operatingMargin": number,
            "netMargin": number,
            "monthOverMonthGrowth": number,
            "bankReconciliation": {
              "difference": number,
              "explanation": "string",
              "manualTransactions": number,
              "bankTransactions": number,
              "unmatchedTransactions": [{ "date": "string", "amount": number, "description": "string" }]
            }
          }
        },
        "balanceSheet": {
          "assets": {
            "current": number,
            "fixed": number,
            "total": number,
            "bankBalances": number
          },
          "liabilities": {
            "current": number,
            "longTerm": number,
            "total": number
          },
          "equity": number,
          "ratios": {
            "currentRatio": number,
            "debtToEquity": number
          },
          "reconciliation": {
            "bankBalance": number,
            "bookBalance": number,
            "difference": number,
            "explanation": "string",
            "openingBalance": number,
            "closingBalance": number,
            "totalDeposits": number,
            "totalWithdrawals": number
          }
        }
      }
    `

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      }
    })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parse the JSON response
    const statements = JSON.parse(text)

    // Save the statements to the database
    await prisma.profitLossStatement.create({
      data: {
        businessId: business.id,
        month: startDate,
        revenue: statements.profitLoss.revenue,
        expenses: statements.profitLoss.expenses,
        netIncome: statements.profitLoss.summary.netIncome,
        grossMargin: statements.profitLoss.summary.grossMargin,
        operatingMargin: statements.profitLoss.summary.operatingMargin,
        netMargin: statements.profitLoss.summary.netMargin,
        monthOverMonthGrowth: statements.profitLoss.summary.monthOverMonthGrowth,
        bankReconciliation: statements.profitLoss.summary.bankReconciliation,
      },
    })

    await prisma.balanceSheet.create({
      data: {
        businessId: business.id,
        month: startDate,
        currentAssets: statements.balanceSheet.assets.current,
        fixedAssets: statements.balanceSheet.assets.fixed,
        totalAssets: statements.balanceSheet.assets.total,
        bankBalances: statements.balanceSheet.assets.bankBalances,
        currentLiabilities: statements.balanceSheet.liabilities.current,
        longTermLiabilities: statements.balanceSheet.liabilities.longTerm,
        totalLiabilities: statements.balanceSheet.liabilities.total,
        equity: statements.balanceSheet.equity,
        currentRatio: statements.balanceSheet.ratios.currentRatio,
        debtToEquity: statements.balanceSheet.ratios.debtToEquity,
        reconciliation: statements.balanceSheet.reconciliation,
      },
    })

    return NextResponse.json(statements)
  } catch (error) {
    console.error("Error generating statements:", error)
    return NextResponse.json(
      { error: "Failed to generate financial statements" },
      { status: 500 }
    )
  }
} 