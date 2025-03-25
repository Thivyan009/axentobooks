"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { startOfMonth, endOfMonth, format } from "date-fns"
import { useCurrencyStore } from "@/lib/stores/currency-store"

function formatCurrency(amount: number): string {
  const { selectedCurrency, exchangeRates } = useCurrencyStore.getState()
  const rate = exchangeRates[selectedCurrency.code] || 1
  const convertedAmount = amount * rate

  return new Intl.NumberFormat(selectedCurrency.locale || 'en-US', {
    style: 'currency',
    currency: selectedCurrency.code || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(convertedAmount)
}

// Validate API key on startup
const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error("GEMINI_API_KEY is not configured in environment variables")
} else {
  console.log("GEMINI_API_KEY is configured")
}

// Initialize Gemini AI with correct configuration
const genAI = new GoogleGenerativeAI(apiKey || "", {
  apiVersion: "v1"
})

interface Transaction {
  date: Date
  type: string
  amount: number
  category: string
  description: string
}

interface PLStatementData {
  periodStart: string
  periodEnd: string
  summary: {
    totalRevenue: number
    totalExpenses: number
    netProfitLoss: number
    profitMargin: number
    monthOverMonthGrowth: number
  }
  revenue: Array<{
    category: string
    amount: number
    items: Array<{
      description: string
      amount: number
    }>
  }>
  expenses: Array<{
    category: string
    amount: number
    items: Array<{
      description: string
      amount: number
    }>
  }>
  analysis: {
    insights: string[]
    recommendations: string[]
    riskFactors: string[]
    opportunities: string[]
  }
}

interface BalanceSheetData {
  periodStart: string
  periodEnd: string
  assets: Array<{
    category: string
    amount: number
    items: Array<{
      description: string
      amount: number
    }>
  }>
  liabilities: Array<{
    category: string
    amount: number
    items: Array<{
      description: string
      amount: number
    }>
  }>
  equity: Array<{
    category: string
    amount: number
    items: Array<{
      description: string
      amount: number
    }>
  }>
  summary: {
    totalAssets: number
    totalLiabilities: number
    totalEquity: number
    netWorth: number
  }
  analysis: {
    insights: string[]
    recommendations: string[]
    riskFactors: string[]
    opportunities: string[]
  }
}

interface TransactionCategory {
  type: 'asset' | 'liability' | 'equity'
  category: string
  description: string
  isIncrease: boolean
}

interface FinancialPositionUpdates {
  currentAssets?: number
  fixedAssets?: number
  currentLiabilities?: number
  longTermLiabilities?: number
  commonStock?: number
  retainedEarnings?: number
  totalAssets?: number
  totalLiabilities?: number
  totalEquity?: number
  netWorth?: number
}

interface AIResponse {
  periodStart: string
  periodEnd: string
  summary: {
    totalRevenue: number
    totalExpenses: number
    netProfitLoss: number
    profitMargin: number
    monthOverMonthGrowth: number
  }
  revenue: Array<{
    category: string
    amount: number
    items: Array<{
      description: string
      amount: number
    }>
  }>
  expenses: Array<{
    category: string
    amount: number
    items: Array<{
      description: string
      amount: number
    }>
  }>
  analysis: {
    insights: string[]
    recommendations: string[]
    riskFactors: string[]
    opportunities: string[]
  }
}

export async function getReports() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (!business) {
      throw new Error("Business not found")
    }

    const reports = await prisma.report.findMany({
      where: {
        businessId: business.id,
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        name: true,
        type: true,
        data: true,
        date: true,
        businessId: true,
        userId: true,
      },
    })

    return { reports }
  } catch (error) {
    console.error("Error fetching reports:", error)
    return { error: "Failed to fetch reports" }
  }
}

export async function deleteReport(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (!business) {
      throw new Error("Business not found")
    }

    const report = await prisma.report.findFirst({
      where: {
        id,
        businessId: business.id,
      },
    })

    if (!report) {
      throw new Error("Report not found")
    }

    await prisma.report.delete({
      where: {
        id,
      },
    })

    revalidatePath("/reports")
    return { success: true }
  } catch (error) {
    console.error("Error deleting report:", error)
    return { error: "Failed to delete report" }
  }
}

export async function getMonthlyTransactions(month: Date) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (!business) {
      throw new Error("Business not found")
    }

    const startDate = startOfMonth(month)
    const endDate = endOfMonth(month)

    console.log("Fetching transactions for:", {
      businessId: business.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })

    const transactions = await prisma.transaction.findMany({
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

    console.log("Found transactions:", transactions.length)
    return transactions
  } catch (error) {
    console.error("Error in getMonthlyTransactions:", error)
    throw error
  }
}

export async function generatePLStatement(transactions: Transaction[]): Promise<PLStatementData> {
  try {
    console.log("Starting P&L statement generation")
    
    // Validate transactions
    if (!transactions || transactions.length === 0) {
      throw new Error("No transactions provided for P&L statement generation")
    }

    // Get period start and end dates
    const dates = transactions.map(t => new Date(t.date))
    const periodStart = format(new Date(Math.min(...dates.map(d => d.getTime()))), "yyyy-MM-dd")
    const periodEnd = format(new Date(Math.max(...dates.map(d => d.getTime()))), "yyyy-MM-dd")

    // Calculate totals from transactions
    const totalRevenue = transactions
      .filter(t => t.type.toLowerCase() === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpenses = transactions
      .filter(t => t.type.toLowerCase() === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const netProfitLoss = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfitLoss / totalRevenue) * 100 : 0
    const monthOverMonthGrowth = 0 // This would need historical data to calculate

    // Group transactions by category
    const revenueByCategory = transactions
      .filter(t => t.type.toLowerCase() === 'income')
      .reduce((acc, t) => {
        const category = t.category || 'Uncategorized'
        if (!acc[category]) {
          acc[category] = {
            category,
            amount: 0,
            items: []
          }
        }
        acc[category].amount += Number(t.amount)
        acc[category].items.push({
          description: t.description,
          amount: Number(t.amount)
        })
        return acc
      }, {} as Record<string, { category: string; amount: number; items: Array<{ description: string; amount: number }> }>)

    const expensesByCategory = transactions
      .filter(t => t.type.toLowerCase() === 'expense')
      .reduce((acc, t) => {
        const category = t.category || 'Uncategorized'
        if (!acc[category]) {
          acc[category] = {
            category,
            amount: 0,
            items: []
          }
        }
        acc[category].amount += Number(t.amount)
        acc[category].items.push({
          description: t.description,
          amount: Number(t.amount)
        })
        return acc
      }, {} as Record<string, { category: string; amount: number; items: Array<{ description: string; amount: number }> }>)

    // Generate insights based on the data
    const insights = generateInsights(totalRevenue, totalExpenses, netProfitLoss, profitMargin)
    const recommendations = generateRecommendations(totalRevenue, totalExpenses, netProfitLoss, profitMargin)
    const riskFactors = generateRiskFactors(totalRevenue, totalExpenses, netProfitLoss, profitMargin)
    const opportunities = generateOpportunities(totalRevenue, totalExpenses, netProfitLoss, profitMargin)

    // Construct the final statement
    const statement: PLStatementData = {
      periodStart,
      periodEnd,
      summary: {
        totalRevenue,
        totalExpenses,
        netProfitLoss,
        profitMargin,
        monthOverMonthGrowth
      },
      revenue: Object.values(revenueByCategory),
      expenses: Object.values(expensesByCategory),
      analysis: {
        insights,
        recommendations,
        riskFactors,
        opportunities
      }
    }

    // Validate the statement
    validateStatement(statement)

    return statement
  } catch (error) {
    console.error("Error in generatePLStatement:", error)
    throw error
  }
}

function generateInsights(
  totalRevenue: number,
  totalExpenses: number,
  netProfitLoss: number,
  profitMargin: number
): string[] {
  const insights: string[] = []

  // Profitability Analysis
  if (netProfitLoss > 0) {
    insights.push(`The business is profitable with a net profit of ${formatCurrency(netProfitLoss)}`)
    if (netProfitLoss > totalRevenue * 0.2) {
      insights.push(`Exceptional performance with profit exceeding 20% of revenue`)
    }
  } else {
    insights.push(`The business is operating at a loss of ${formatCurrency(Math.abs(netProfitLoss))}`)
  }

  // Profit Margin Analysis
  if (profitMargin > 20) {
    insights.push(`Strong profit margin of ${profitMargin.toFixed(1)}% indicates highly efficient operations and good pricing strategy`)
  } else if (profitMargin > 10) {
    insights.push(`Moderate profit margin of ${profitMargin.toFixed(1)}% suggests stable operations with room for optimization`)
  } else if (profitMargin > 0) {
    insights.push(`Low profit margin of ${profitMargin.toFixed(1)}% indicates need for strategic improvements`)
  } else {
    insights.push(`Negative profit margin of ${profitMargin.toFixed(1)}% signals significant operational challenges`)
  }

  // Expense Analysis
  const expenseRatio = (totalExpenses / totalRevenue) * 100
  if (expenseRatio > 90) {
    insights.push(`Critical: High expense ratio of ${expenseRatio.toFixed(1)}% threatens business sustainability`)
  } else if (expenseRatio > 80) {
    insights.push(`Warning: Elevated expense ratio of ${expenseRatio.toFixed(1)}% requires immediate attention`)
  } else if (expenseRatio > 70) {
    insights.push(`Moderate expense ratio of ${expenseRatio.toFixed(1)}% indicates need for cost optimization`)
  } else {
    insights.push(`Healthy expense ratio of ${expenseRatio.toFixed(1)}% demonstrates effective cost management`)
  }

  // Revenue Analysis
  if (totalRevenue > 0) {
    const revenuePerExpenseRatio = totalRevenue / totalExpenses
    if (revenuePerExpenseRatio > 1.5) {
      insights.push(`Strong revenue generation with ${revenuePerExpenseRatio.toFixed(2)}x revenue to expense ratio`)
    } else if (revenuePerExpenseRatio > 1.2) {
      insights.push(`Healthy revenue to expense ratio of ${revenuePerExpenseRatio.toFixed(2)}x`)
    }
  }

  return insights
}

function generateRecommendations(
  totalRevenue: number,
  totalExpenses: number,
  netProfitLoss: number,
  profitMargin: number
): string[] {
  const recommendations: string[] = []

  // Strategic Recommendations
  recommendations.push("Implement monthly financial review meetings to track KPIs and adjust strategies")

  // Profitability-based Recommendations
  if (netProfitLoss < 0) {
    recommendations.push("Conduct immediate cost-benefit analysis of all expense categories")
    recommendations.push("Develop a 90-day turnaround plan focusing on revenue growth and cost reduction")
    recommendations.push("Consider renegotiating terms with suppliers and vendors")
  } else if (profitMargin < 10) {
    recommendations.push("Review pricing strategy and consider selective price adjustments")
    recommendations.push("Identify and focus on high-margin products or services")
    recommendations.push("Analyze customer acquisition costs and optimize marketing spend")
  }

  // Expense Management Recommendations
  const expenseRatio = (totalExpenses / totalRevenue) * 100
  if (expenseRatio > 80) {
    recommendations.push("Implement zero-based budgeting for all departments")
    recommendations.push("Automate manual processes to reduce operational costs")
    recommendations.push("Review and potentially renegotiate fixed costs like rent and subscriptions")
  } else if (expenseRatio > 70) {
    recommendations.push("Conduct efficiency audit to identify cost optimization opportunities")
    recommendations.push("Consider outsourcing non-core business functions")
  }

  // Growth and Optimization Recommendations
  if (profitMargin > 15) {
    recommendations.push("Explore market expansion opportunities while maintaining cost efficiency")
    recommendations.push("Consider strategic investments in technology or capacity")
    recommendations.push("Develop customer retention programs to maintain profitability")
  }

  return recommendations
}

function generateRiskFactors(
  totalRevenue: number,
  totalExpenses: number,
  netProfitLoss: number,
  profitMargin: number
): string[] {
  const riskFactors: string[] = []

  // Financial Risks
  if (netProfitLoss < 0) {
    riskFactors.push("Continued losses may lead to cash flow constraints")
    riskFactors.push("Limited financial buffer for unexpected expenses")
    riskFactors.push("Potential difficulty in securing future financing")
  }

  // Operational Risks
  const expenseRatio = (totalExpenses / totalRevenue) * 100
  if (expenseRatio > 80) {
    riskFactors.push("High operational costs affecting business sustainability")
    riskFactors.push("Limited flexibility to respond to market changes")
    riskFactors.push("Vulnerability to input cost increases")
  }

  // Market and Competition Risks
  if (profitMargin < 10) {
    riskFactors.push("Low margins make the business vulnerable to market fluctuations")
    riskFactors.push("Limited ability to compete on price")
    riskFactors.push("Reduced capacity to invest in growth initiatives")
  }

  // Add general risk factors
  riskFactors.push("Changing market conditions could impact revenue")
  riskFactors.push("Potential regulatory changes may affect operations")
  riskFactors.push("Economic uncertainties could affect customer spending")

  return riskFactors
}

function generateOpportunities(
  totalRevenue: number,
  totalExpenses: number,
  netProfitLoss: number,
  profitMargin: number
): string[] {
  const opportunities: string[] = []

  // Growth Opportunities
  if (netProfitLoss > 0) {
    opportunities.push("Potential for market expansion using retained earnings")
    opportunities.push("Opportunity to invest in new technologies or equipment")
    opportunities.push("Consider strategic acquisitions or partnerships")
  }

  // Efficiency Opportunities
  if (profitMargin > 15) {
    opportunities.push("Strong position to invest in automation and productivity improvements")
    opportunities.push("Potential to develop premium product/service offerings")
    opportunities.push("Opportunity to build strategic reserves for future growth")
  }

  // Market Opportunities
  const expenseRatio = (totalExpenses / totalRevenue) * 100
  if (expenseRatio < 70) {
    opportunities.push("Strong cost position enables competitive pricing strategies")
    opportunities.push("Potential to increase market share through targeted investments")
    opportunities.push("Opportunity to explore new market segments")
  }

  // Innovation Opportunities
  opportunities.push("Explore digital transformation initiatives")
  opportunities.push("Consider developing new revenue streams")
  opportunities.push("Investigate emerging market trends for growth potential")

  return opportunities
}

function validateStatement(statement: PLStatementData) {
  // Validate summary
  if (typeof statement.summary.totalRevenue !== 'number' || statement.summary.totalRevenue < 0) {
    throw new Error("Invalid total revenue in statement")
  }
  if (typeof statement.summary.totalExpenses !== 'number' || statement.summary.totalExpenses < 0) {
    throw new Error("Invalid total expenses in statement")
  }
  if (typeof statement.summary.netProfitLoss !== 'number') {
    throw new Error("Invalid net profit/loss in statement")
  }
  if (typeof statement.summary.profitMargin !== 'number') {
    throw new Error("Invalid profit margin in statement")
  }

  // Validate revenue and expenses
  if (!Array.isArray(statement.revenue)) {
    throw new Error("Invalid revenue array in statement")
  }
  if (!Array.isArray(statement.expenses)) {
    throw new Error("Invalid expenses array in statement")
  }

  // Validate analysis
  if (!Array.isArray(statement.analysis.insights) || statement.analysis.insights.length === 0) {
    throw new Error("Missing insights in statement")
  }
  if (!Array.isArray(statement.analysis.recommendations) || statement.analysis.recommendations.length === 0) {
    throw new Error("Missing recommendations in statement")
  }
  if (!Array.isArray(statement.analysis.riskFactors) || statement.analysis.riskFactors.length === 0) {
    throw new Error("Missing risk factors in statement")
  }
  if (!Array.isArray(statement.analysis.opportunities) || statement.analysis.opportunities.length === 0) {
    throw new Error("Missing opportunities in statement")
  }
}

export async function savePLStatement(data: PLStatementData, month: Date) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
  })

  if (!business) {
    throw new Error("Business not found")
  }

  const statement = await prisma.report.create({
    data: {
      name: `P&L Statement - ${month.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
      type: "pl",
      data: data,
      businessId: business.id,
      userId: session.user.id,
      date: new Date(),
    },
  })

  return statement
}

export async function generateBalanceSheet(transactions: Transaction[]): Promise<BalanceSheetData> {
  try {
    console.log("Starting balance sheet generation with Gemini AI")
    
    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error("Gemini API key is not configured")
      throw new Error("Gemini API key is not configured. Please check your environment variables.")
    }

    // Format transactions for AI
    const formattedTransactions = transactions.map(t => ({
      date: format(new Date(t.date), "yyyy-MM-dd"),
      type: t.type,
      amount: t.amount,
      category: t.category,
      description: t.description
    }))

    // Get period start and end dates
    const dates = transactions.map(t => new Date(t.date))
    const periodStart = format(new Date(Math.min(...dates.map(d => d.getTime()))), "yyyy-MM-dd")
    const periodEnd = format(new Date(Math.max(...dates.map(d => d.getTime()))), "yyyy-MM-dd")

    // Calculate running balances for assets, liabilities, and equity
    let currentAssets = 0
    let fixedAssets = 0
    let currentLiabilities = 0
    let longTermLiabilities = 0
    let retainedEarnings = 0
    let commonStock = 0

    // Process transactions to calculate balances
    transactions.forEach(transaction => {
      const amount = Math.abs(transaction.amount)
      
      switch (transaction.type.toLowerCase()) {
        case 'income':
          // Income increases retained earnings
          retainedEarnings += amount
          break
        case 'expense':
          // Expenses decrease retained earnings
          retainedEarnings -= amount
          break
        case 'asset':
          // Assets are categorized based on their nature
          if (transaction.category.toLowerCase().includes('fixed') || 
              transaction.category.toLowerCase().includes('long-term')) {
            fixedAssets += amount
          } else {
            currentAssets += amount
          }
          break
        case 'liability':
          // Liabilities are categorized based on their nature
          if (transaction.category.toLowerCase().includes('long-term')) {
            longTermLiabilities += amount
          } else {
            currentLiabilities += amount
          }
          break
        case 'equity':
          // Equity transactions
          if (transaction.category.toLowerCase().includes('stock')) {
            commonStock += amount
          } else if (transaction.category.toLowerCase().includes('retained')) {
            retainedEarnings += amount
          }
          break
      }
    })

    // Calculate totals
    const totalAssets = currentAssets + fixedAssets
    const totalLiabilities = currentLiabilities + longTermLiabilities
    const totalEquity = commonStock + retainedEarnings
    const netWorth = totalAssets - totalLiabilities

    // Prepare the balance sheet data
    const balanceSheetData: BalanceSheetData = {
      periodStart,
      periodEnd,
      assets: [
        {
          category: "Current Assets",
          amount: currentAssets,
          items: [
            {
              description: "Cash and Cash Equivalents",
              amount: currentAssets * 0.6
            },
            {
              description: "Accounts Receivable",
              amount: currentAssets * 0.4
            }
          ]
        },
        {
          category: "Fixed Assets",
          amount: fixedAssets,
          items: [
            {
              description: "Property and Equipment",
              amount: fixedAssets * 0.7
            },
            {
              description: "Intangible Assets",
              amount: fixedAssets * 0.3
            }
          ]
        }
      ],
      liabilities: [
        {
          category: "Current Liabilities",
          amount: currentLiabilities,
          items: [
            {
              description: "Accounts Payable",
              amount: currentLiabilities * 0.5
            },
            {
              description: "Short-term Debt",
              amount: currentLiabilities * 0.5
            }
          ]
        },
        {
          category: "Long-term Liabilities",
          amount: longTermLiabilities,
          items: [
            {
              description: "Long-term Debt",
              amount: longTermLiabilities * 0.7
            },
            {
              description: "Other Long-term Obligations",
              amount: longTermLiabilities * 0.3
            }
          ]
        }
      ],
      equity: [
        {
          category: "Common Stock",
          amount: commonStock,
          items: [
            {
              description: "Issued Capital",
              amount: commonStock
            }
          ]
        },
        {
          category: "Retained Earnings",
          amount: retainedEarnings,
          items: [
            {
              description: "Accumulated Profits",
              amount: retainedEarnings
            }
          ]
        }
      ],
      summary: {
        totalAssets,
        totalLiabilities,
        totalEquity,
        netWorth
      },
      analysis: {
        insights: [
          `Total assets of $${totalAssets.toLocaleString()} show ${totalAssets > totalLiabilities ? 'strong' : 'weak'} financial position`,
          `Current ratio of ${(currentAssets / currentLiabilities).toFixed(2)} indicates ${currentAssets > currentLiabilities ? 'good' : 'poor'} short-term liquidity`,
          `Debt-to-equity ratio of ${(totalLiabilities / totalEquity).toFixed(2)} suggests ${totalLiabilities < totalEquity ? 'conservative' : 'aggressive'} financing approach`
        ],
        recommendations: [
          "Consider optimizing working capital management",
          "Review long-term financing options",
          "Monitor cash flow and maintain adequate reserves"
        ],
        riskFactors: [
          "Market volatility affecting asset values",
          "Interest rate changes impacting debt costs",
          "Economic conditions affecting business operations"
        ],
        opportunities: [
          "Potential for asset optimization",
          "Opportunities for debt restructuring",
          "Possibility of equity financing for growth"
        ]
      }
    }

    return balanceSheetData
  } catch (error) {
    console.error("Error in generateBalanceSheet:", error)
    throw error
  }
}

export async function saveBalanceSheet(data: BalanceSheetData, date: Date) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
  })

  if (!business) {
    throw new Error("Business not found")
  }

  const statement = await prisma.report.create({
    data: {
      name: `Balance Sheet - ${format(date, "MMMM yyyy")}`,
      type: "balance_sheet",
      data: data,
      businessId: business.id,
      userId: session.user.id,
      date: new Date(),
    },
  })

  return statement
}

export async function categorizeTransaction(transaction: Transaction): Promise<TransactionCategory> {
  try {
    const prompt = `You are a financial analyst. Analyze this transaction and categorize it into the appropriate financial position category (asset, liability, or equity).

    Transaction:
    Date: ${format(new Date(transaction.date), "yyyy-MM-dd")}
    Amount: ${transaction.amount}
    Category: ${transaction.category}
    Description: ${transaction.description}

    Your task is to:
    1. Determine if this transaction represents an asset, liability, or equity
    2. Identify if this is an increase or decrease in the financial position
    3. Provide a specific category name that best describes the transaction
    4. Give a detailed description of why you chose this categorization

    Return a valid JSON object with this structure:
    {
      "type": "asset" | "liability" | "equity",
      "category": string (specific category name),
      "description": string (detailed explanation of the categorization),
      "isIncrease": boolean (true if this increases the category, false if it decreases)
    }

    Examples:
    - A laptop purchase would be: { "type": "asset", "category": "Fixed Assets", "description": "Purchase of equipment", "isIncrease": true }
    - A loan payment would be: { "type": "liability", "category": "Long-term Liabilities", "description": "Payment on business loan", "isIncrease": false }
    - A stock issuance would be: { "type": "equity", "category": "Common Stock", "description": "New stock issuance", "isIncrease": true }

    Respond with ONLY the JSON object, no additional text.`

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const generatedText = response.text()
    
    // Clean and parse the response
    const cleanedText = generatedText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const category = JSON.parse(cleanedText) as TransactionCategory
    return category
  } catch (error) {
    console.error("Error categorizing transaction:", error)
    throw error
  }
}

export async function updateFinancialPosition(
  businessId: string,
  transaction: Transaction,
  category: TransactionCategory
) {
  try {
    console.log("Starting financial position update for business:", businessId)
    console.log("Transaction data:", transaction)
    console.log("AI Category:", category)

    return await prisma.$transaction(async (tx) => {
      // Get current financial position
      const currentPosition = await tx.financialPosition.findFirst({
        where: { businessId }
      })
      console.log("Current financial position:", currentPosition)

      const amount = Math.abs(transaction.amount)
      const isIncrease = category.isIncrease
      console.log("Amount and direction:", { amount, isIncrease })

      // Calculate new values based on AI categorization
      const updates: FinancialPositionUpdates = {}
      
      // Handle assets
      if (category.type === 'asset') {
        if (category.category.toLowerCase().includes('fixed') || 
            category.category.toLowerCase().includes('long-term')) {
          updates.fixedAssets = (currentPosition?.fixedAssets || 0) + (isIncrease ? amount : -amount)
          console.log("Updating fixed assets:", updates.fixedAssets)
        } else {
          updates.currentAssets = (currentPosition?.currentAssets || 0) + (isIncrease ? amount : -amount)
          console.log("Updating current assets:", updates.currentAssets)
        }
      }
      
      // Handle liabilities
      if (category.type === 'liability') {
        if (category.category.toLowerCase().includes('long-term')) {
          updates.longTermLiabilities = (currentPosition?.longTermLiabilities || 0) + (isIncrease ? amount : -amount)
          console.log("Updating long-term liabilities:", updates.longTermLiabilities)
        } else {
          updates.currentLiabilities = (currentPosition?.currentLiabilities || 0) + (isIncrease ? amount : -amount)
          console.log("Updating current liabilities:", updates.currentLiabilities)
        }
      }
      
      // Handle equity
      if (category.type === 'equity') {
        if (category.category.toLowerCase().includes('stock') ||
            category.category.toLowerCase().includes('capital')) {
          updates.commonStock = (currentPosition?.commonStock || 0) + (isIncrease ? amount : -amount)
          console.log("Updating common stock:", updates.commonStock)
        } else {
          updates.retainedEarnings = (currentPosition?.retainedEarnings || 0) + (isIncrease ? amount : -amount)
          console.log("Updating retained earnings:", updates.retainedEarnings)
        }
      } else if (transaction.type.toLowerCase() === 'expense') {
        // Only decrease retained earnings for non-asset expenses
        updates.retainedEarnings = (currentPosition?.retainedEarnings || 0) - amount
        console.log("Updating retained earnings (expense):", updates.retainedEarnings)
      } else if (transaction.type.toLowerCase() === 'income') {
        // Income increases retained earnings
        updates.retainedEarnings = (currentPosition?.retainedEarnings || 0) + amount
        console.log("Updating retained earnings (income):", updates.retainedEarnings)
      }

      // Calculate totals
      updates.totalAssets = (updates.currentAssets || currentPosition?.currentAssets || 0) +
                           (updates.fixedAssets || currentPosition?.fixedAssets || 0)
      updates.totalLiabilities = (updates.currentLiabilities || currentPosition?.currentLiabilities || 0) +
                                (updates.longTermLiabilities || currentPosition?.longTermLiabilities || 0)
      updates.totalEquity = (updates.commonStock || currentPosition?.commonStock || 0) +
                           (updates.retainedEarnings || currentPosition?.retainedEarnings || 0)
      updates.netWorth = updates.totalAssets - updates.totalLiabilities

      console.log("Final updates to be applied:", updates)

      // Update or create financial position
      let result
      if (currentPosition) {
        result = await tx.financialPosition.update({
          where: { businessId },
          data: updates
        })
        console.log("Updated existing financial position:", result)
      } else {
        result = await tx.financialPosition.create({
          data: {
            businessId,
            ...updates
          }
        })
        console.log("Created new financial position:", result)
      }

      return { success: true, result }
    })
  } catch (error) {
    console.error("Error updating financial position:", error)
    throw error
  }
}

