import type { ProfitLossStatement } from "./ai"

export interface BalanceSheet {
  date: string
  assets: {
    category: string
    amount: number
    items: Array<{ description: string; amount: number }>
  }[]
  liabilities: {
    category: string
    amount: number
    items: Array<{ description: string; amount: number }>
  }[]
  equity: {
    category: string
    amount: number
    items: Array<{ description: string; amount: number }>
  }[]
  summary: {
    totalAssets: number
    totalLiabilities: number
    totalEquity: number
    currentRatio: number
    debtToEquityRatio: number
  }
  analysis: {
    insights: string[]
    recommendations: string[]
    riskFactors: string[]
  }
}

export interface SavedReport {
  id: string
  type: "pl" | "balance"
  name: string
  date: string
  data: ProfitLossStatement | BalanceSheet
}

