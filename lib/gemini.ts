import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

interface Insights {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  expenses: {
    current: number
    previous: number
    growth: number
  }
  cashFlow: {
    current: number
    previous: number
    growth: number
  }
  growth: {
    current: number
    previous: number
    historical: number[]
  }
}

export interface AnalyzedTransaction {
  date: string
  description: string
  amount: string
  category: string
  type: "income" | "expense"
  notes?: string
  confidence: number
}

interface Transaction {
  date: string
  description: string
  amount: number
  category?: string
  type?: "income" | "expense"
  notes?: string
}

interface TransactionAnalysis {
  category: string
  notes?: string
  confidence: number
}

interface TransactionData {
  description: string
  amount: string
  date: string
}

export async function analyzeTransactions(transaction: TransactionData): Promise<TransactionAnalysis> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  const prompt = `Analyze the following financial transaction and provide a structured analysis:

Transaction Details:
- Description: ${transaction.description}
- Amount: ${transaction.amount}
- Date: ${transaction.date}

Please categorize this transaction and provide insights. Return the response in the following JSON format:
{
  "category": "string (e.g., 'Utilities', 'Food & Dining', 'Income', 'Transportation', etc.)",
  "notes": "string (brief explanation or additional context)",
  "confidence": number (between 0 and 1, indicating confidence in the categorization)
}

Focus on accuracy and consistency in categorization.`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid response format")
    }

    const analysis = JSON.parse(jsonMatch[0])

    // Validate the response structure
    if (!analysis.category || typeof analysis.confidence !== "number") {
      throw new Error("Invalid analysis structure")
    }

    return {
      category: analysis.category,
      notes: analysis.notes,
      confidence: analysis.confidence,
    }
  } catch (error) {
    console.error("Error analyzing transaction:", error)
    // Return a default categorization if analysis fails
    return {
      category: "Uncategorized",
      notes: "Failed to analyze transaction",
      confidence: 0,
    }
  }
}

export async function generateChatResponse(prompt: string) {
  try {
    console.log("Initializing chat with prompt:", prompt);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Model initialized, generating content...");
    const result = await model.generateContent(prompt);
    console.log("Content generated, getting response...");
    const response = await result.response;
    const text = response.text();
    console.log(`Response received: ${text.substring(0, 100)}...`);
    return text;
  } catch (error) {
    console.error("Detailed error in generateChatResponse:", {
      error: error,
      message: error.message,
      stack: error.stack
    });
    throw new Error(`Failed to generate chat response: ${error.message}`);
  }
}

export async function generateFinancialInsights(data: FinancialData): Promise<Insights> {
  try {
    // Since we already have the calculated metrics from calculateFinancialData,
    // we can just return them directly without using Gemini AI
    return {
      revenue: {
        current: data.revenue.current,
        previous: data.revenue.previous,
        growth: data.revenue.growth,
      },
      expenses: {
        current: data.expenses.current,
        previous: data.expenses.previous,
        growth: data.expenses.growth,
      },
      cashFlow: {
        current: data.cashFlow.current,
        previous: data.cashFlow.previous,
        growth: data.cashFlow.growth,
      },
      growth: {
        current: data.growth.current,
        previous: data.growth.previous,
        historical: data.growth.historical,
      },
    }
  } catch (error) {
    console.error("Error generating financial insights:", error)
    throw error
  }
}

interface FinancialData {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  expenses: {
    current: number
    previous: number
    growth: number
  }
  cashFlow: {
    current: number
    previous: number
    growth: number
  }
  growth: {
    current: number
    previous: number
    historical: number[]
  }
}

interface TrendData {
  trend: string
  percentage: number
  direction: "up" | "down" | "stable"
  keyDrivers?: string[]
  riskFactors?: string[]
  recommendations?: string[]
  costStructure?: string
  efficiencyMetrics?: string[]
  optimizationOpportunities?: string[]
  liquidityMetrics?: string[]
  workingCapitalAnalysis?: string
  cashManagementRecommendations?: string[]
  marketShareAnalysis?: string
  growthDrivers?: string[]
  strategicInitiatives?: string[]
}

interface FinancialTrends {
  revenue: TrendData
  expenses: TrendData
  cashFlow: TrendData
  growth: TrendData
  financialHealth: {
    overallScore: number
    keyStrengths: string[]
    keyWeaknesses: string[]
    riskAssessment: string
    strategicRecommendations: string[]
  }
}

export async function analyzeFinancialTrends(data: FinancialData): Promise<FinancialTrends> {
  try {
    // Validate input data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid input data')
    }

    // Validate required fields
    const inputRequiredFields = ['revenue', 'expenses', 'cashFlow', 'growth']
    const missingInputFields = inputRequiredFields.filter(field => !data[field])
    if (missingInputFields.length > 0) {
      throw new Error(`Missing required fields: ${missingInputFields.join(', ')}`)
    }

    // Validate numeric values
    if (typeof data.revenue.current !== 'number' || typeof data.revenue.previous !== 'number') {
      throw new Error('Invalid revenue data')
    }
    if (typeof data.expenses.current !== 'number' || typeof data.expenses.previous !== 'number') {
      throw new Error('Invalid expenses data')
    }
    if (typeof data.cashFlow.current !== 'number' || typeof data.cashFlow.previous !== 'number') {
      throw new Error('Invalid cash flow data')
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    
    const prompt = `As a Chartered Financial Analyst (CFA), analyze the following financial data and provide a comprehensive trend analysis. 
    Consider key financial metrics, ratios, and industry standards. Return the response in this exact JSON format:

    {
      "revenue": {
        "trend": "detailed analysis of revenue trends including growth drivers and market position",
        "percentage": number between -100 and 100,
        "direction": "up" or "down" or "stable",
        "keyDrivers": ["list of main factors driving revenue"],
        "riskFactors": ["list of potential risks to revenue"],
        "recommendations": ["list of strategic recommendations"]
      },
      "expenses": {
        "trend": "detailed analysis of expense trends including cost structure and efficiency",
        "percentage": number between -100 and 100,
        "direction": "up" or "down" or "stable",
        "costStructure": "analysis of fixed vs variable costs",
        "efficiencyMetrics": ["list of key efficiency indicators"],
        "optimizationOpportunities": ["list of cost optimization suggestions"]
      },
      "cashFlow": {
        "trend": "detailed analysis of cash flow trends including working capital and liquidity",
        "percentage": number between -100 and 100,
        "direction": "up" or "down" or "stable",
        "liquidityMetrics": ["list of key liquidity ratios"],
        "workingCapitalAnalysis": "analysis of working capital efficiency",
        "cashManagementRecommendations": ["list of cash management suggestions"]
      },
      "growth": {
        "trend": "detailed analysis of growth trends including market share and competitive position",
        "percentage": number between -100 and 100,
        "direction": "up" or "down" or "stable",
        "marketShareAnalysis": "analysis of market position",
        "growthDrivers": ["list of key growth drivers"],
        "strategicInitiatives": ["list of recommended growth strategies"]
      },
      "financialHealth": {
        "overallScore": number between 0 and 100,
        "keyStrengths": ["list of financial strengths"],
        "keyWeaknesses": ["list of financial weaknesses"],
        "riskAssessment": "comprehensive risk analysis",
        "strategicRecommendations": ["list of strategic recommendations"]
      }
    }

    Financial Data:
    Revenue:
    - Current: ${data.revenue.current}
    - Previous: ${data.revenue.previous}
    - Growth: ${data.revenue.growth}%

    Expenses:
    - Current: ${data.expenses.current}
    - Previous: ${data.expenses.previous}
    - Growth: ${data.expenses.growth}%

    Cash Flow:
    - Current: ${data.cashFlow.current}
    - Previous: ${data.cashFlow.previous}
    - Growth: ${data.cashFlow.growth}%

    Growth:
    - Current: ${data.growth.current}%
    - Previous: ${data.growth.previous}%
    - Historical: ${data.growth.historical.join(', ')}%

    Analyze the trends based on the current, previous, and historical values provided.
    Calculate percentages as ((current - previous) / previous) * 100
    Determine direction based on the percentage change:
    - "up" if percentage > 5
    - "down" if percentage < -5
    - "stable" if percentage is between -5 and 5

    Consider the following in your analysis:
    1. Industry benchmarks and standards
    2. Economic indicators and market conditions
    3. Competitive landscape
    4. Risk factors and mitigation strategies
    5. Strategic implications and recommendations
    6. Financial ratios and key performance indicators
    7. Working capital management
    8. Cash flow optimization opportunities
    9. Growth potential and market opportunities
    10. Operational efficiency metrics
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    let trends: FinancialTrends
    try {
      trends = JSON.parse(jsonMatch[0]) as FinancialTrends
    } catch (parseError) {
      throw new Error("Invalid JSON format in AI response")
    }
    
    // Validate the response structure
    const responseRequiredFields = ['revenue', 'expenses', 'cashFlow', 'growth', 'financialHealth']
    const missingResponseFields = responseRequiredFields.filter(field => !trends[field])
    
    if (missingResponseFields.length > 0) {
      throw new Error(`Missing required fields in response: ${missingResponseFields.join(', ')}`)
    }

    // Validate each trend object
    for (const field of responseRequiredFields) {
      const trend = trends[field]
      if (!trend || typeof trend !== 'object') {
        throw new Error(`Invalid ${field} trend data structure`)
      }
      if (!trend.trend || typeof trend.percentage !== 'number' || !['up', 'down', 'stable'].includes(trend.direction)) {
        throw new Error(`Invalid ${field} trend data`)
      }
    }

    return trends
  } catch (error) {
    console.error("Error analyzing financial trends:", error)
    throw error
  }
} 