export interface ProfitLossStatement {
  periodStart: string
  periodEnd: string
  revenue: {
    category: string
    amount: number
    items: Array<{ description: string; amount: number }>
  }[]
  expenses: {
    category: string
    amount: number
    items: Array<{ description: string; amount: number }>
  }[]
  summary: {
    totalRevenue: number
    totalExpenses: number
    netProfitLoss: number
    profitMargin: number
    monthOverMonthGrowth: number
  }
  analysis: {
    insights: string[]
    recommendations: string[]
    riskFactors: string[]
    opportunities: string[]
  }
}

