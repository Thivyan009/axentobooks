"use client"

import { ArrowUpRight, TrendingUp, AlertCircle, DollarSign, LineChart, PieChart, BarChart3, Wallet } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery } from "@tanstack/react-query"
import { getFinancialMetrics, getTransactions } from "@/lib/actions/transactions"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import type { DateRange } from "react-day-picker"

interface FinancialInsightsProps {
  dateRange?: DateRange
}

interface Insight {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  trend: "up" | "down" | "neutral"
}

export function FinancialInsights({ dateRange }: FinancialInsightsProps) {
  const { selectedCurrency } = useCurrencyStore()

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["financial-metrics", dateRange?.from, dateRange?.to],
    queryFn: async () => {
      const result = await getFinancialMetrics()
      if (result.error) {
        throw new Error(result.error)
      }
      return result.metrics
    },
  })

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", dateRange?.from, dateRange?.to],
    queryFn: async () => {
      const result = await getTransactions()
      if (result.error) {
        throw new Error(result.error)
      }
      return result.transactions || []
    },
  })

  if (metricsLoading || transactionsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading insights...</div>
      </div>
    )
  }

  const insights: Insight[] = []

  // 1. Revenue Growth Insight
  if (metrics?.revenueGrowth) {
    insights.push({
      id: "revenue-growth",
      title: "Revenue Growth",
      description: `Revenue has ${metrics.revenueGrowth > 0 ? 'increased' : 'decreased'} by ${Math.abs(metrics.revenueGrowth).toFixed(1)}% compared to the previous period. ${
        metrics.revenueGrowth > 0 
          ? 'Strong revenue growth indicates effective sales and pricing strategies.'
          : 'Consider reviewing pricing strategy and sales channels.'
      }`,
      icon: <LineChart className="h-4 w-4" />,
      trend: metrics.revenueGrowth > 0 ? "up" : "down",
    })
  }

  // 2. Profit Margin Analysis
  if (metrics?.totalRevenue && metrics?.totalExpenses) {
    const profitMargin = ((metrics.totalRevenue - metrics.totalExpenses) / metrics.totalRevenue) * 100
    insights.push({
      id: "profit-margin",
      title: "Profit Margin",
      description: `Current profit margin is ${profitMargin.toFixed(1)}%. ${
        profitMargin > 20 
          ? 'Healthy profit margin indicates strong business performance.'
          : profitMargin > 10
          ? 'Moderate profit margin suggests room for optimization.'
          : 'Consider strategies to improve profitability.'
      }`,
      icon: <PieChart className="h-4 w-4" />,
      trend: profitMargin > 15 ? "up" : profitMargin > 10 ? "neutral" : "down",
    })
  }

  // 3. Expense Ratio
  if (metrics?.totalRevenue && metrics?.totalExpenses) {
    const expenseRatio = (metrics.totalExpenses / metrics.totalRevenue) * 100
    insights.push({
      id: "expense-ratio",
      title: "Expense Ratio",
      description: `Expenses represent ${expenseRatio.toFixed(1)}% of revenue. ${
        expenseRatio < 70
          ? 'Good cost control maintained.'
          : 'Consider cost reduction strategies.'
      }`,
      icon: <BarChart3 className="h-4 w-4" />,
      trend: expenseRatio < 70 ? "up" : expenseRatio < 80 ? "neutral" : "down",
    })
  }

  // 4. Cash Flow Health
  if (metrics?.cashFlow) {
    const cashFlowHealth = metrics.cashFlow
    insights.push({
      id: "cash-flow",
      title: "Cash Flow Health",
      description: `Net cash flow is ${formatCurrency(cashFlowHealth, selectedCurrency.code)}. ${
        cashFlowHealth > 0
          ? cashFlowHealth > 10000
            ? 'Strong positive cash flow indicates excellent financial health.'
            : 'Positive cash flow maintained, but consider growth opportunities.'
          : 'Review cash management strategies to improve flow.'
      }`,
      icon: <DollarSign className="h-4 w-4" />,
      trend: cashFlowHealth > 0 ? "up" : "down",
    })
  }

  // 5. Average Transaction Value
  if (transactions?.length && metrics?.totalRevenue) {
    const avgTransaction = metrics.totalRevenue / transactions.length
    const avgTransactionTrend = avgTransaction > 1000 ? "up" : avgTransaction > 500 ? "neutral" : "down"
    insights.push({
      id: "avg-transaction",
      title: "Average Transaction Value",
      description: `Average transaction is ${formatCurrency(avgTransaction, selectedCurrency.code)}. ${
        avgTransactionTrend === "up"
          ? 'High-value transactions driving revenue.'
          : avgTransactionTrend === "neutral"
          ? 'Moderate transaction values, consider upselling.'
          : 'Focus on increasing transaction values.'
      }`,
      icon: <Wallet className="h-4 w-4" />,
      trend: avgTransactionTrend,
    })
  }

  // 6. Revenue Concentration
  if (transactions?.length) {
    const categories = transactions.reduce((acc, t) => {
      if (t.type === 'income') {
        acc[t.category] = (acc[t.category] || 0) + t.amount
      }
      return acc
    }, {} as Record<string, number>)
    
    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]
    if (topCategory && metrics?.totalRevenue) {
      const concentration = (topCategory[1] / metrics.totalRevenue) * 100
      insights.push({
        id: "revenue-concentration",
        title: "Revenue Concentration",
        description: `${topCategory[0]} represents ${concentration.toFixed(1)}% of revenue. ${
          concentration > 50
            ? 'High concentration risk. Consider diversifying revenue streams.'
            : 'Good revenue diversification maintained.'
        }`,
        icon: <PieChart className="h-4 w-4" />,
        trend: concentration < 50 ? "up" : "down",
      })
    }
  }

  // 7. Operating Efficiency
  if (metrics?.operationalExpenses && metrics?.totalRevenue) {
    const operatingEfficiency = (metrics.operationalExpenses / metrics.totalRevenue) * 100
    insights.push({
      id: "operating-efficiency",
      title: "Operating Efficiency",
      description: `Operating expenses are ${operatingEfficiency.toFixed(1)}% of revenue. ${
        operatingEfficiency < 60
          ? 'Excellent operational efficiency.'
          : operatingEfficiency < 80
          ? 'Moderate efficiency, room for improvement.'
          : 'Consider operational cost optimization.'
      }`,
      icon: <TrendingUp className="h-4 w-4" />,
      trend: operatingEfficiency < 70 ? "up" : operatingEfficiency < 80 ? "neutral" : "down",
    })
  }

  // 8. Working Capital Analysis
  if (metrics?.currentAssets && metrics?.currentLiabilities) {
    const workingCapitalRatio = metrics.currentAssets / metrics.currentLiabilities
    insights.push({
      id: "working-capital",
      title: "Working Capital Ratio",
      description: `Current ratio is ${workingCapitalRatio.toFixed(2)}x. ${
        workingCapitalRatio > 2
          ? 'Strong working capital position.'
          : workingCapitalRatio > 1.5
          ? 'Healthy working capital maintained.'
          : 'Monitor working capital closely.'
      }`,
      icon: <AlertCircle className="h-4 w-4" />,
      trend: workingCapitalRatio > 1.5 ? "up" : workingCapitalRatio > 1 ? "neutral" : "down",
    })
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50"
          >
            <div
              className={`rounded-full p-2 ${
                insight.trend === "up"
                  ? "bg-green-100 text-green-600"
                  : insight.trend === "down"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {insight.icon}
            </div>
            <div>
              <h4 className="font-medium">{insight.title}</h4>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

