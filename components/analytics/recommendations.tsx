"use client"

import { useQuery } from "@tanstack/react-query"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getFinancialMetrics, getTransactions } from "@/lib/actions/transactions"
import { Lightbulb, TrendingUp, AlertCircle, DollarSign, Target, ShieldCheck, ArrowUpRight, BarChart3 } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"

interface RecommendationsProps {
  dateRange?: DateRange
}

interface Recommendation {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  icon: React.ReactNode
  category: "growth" | "risk" | "optimization" | "opportunity"
}

export function Recommendations({ dateRange }: RecommendationsProps) {
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
        <div className="text-sm text-muted-foreground">Loading recommendations...</div>
      </div>
    )
  }

  const recommendations: Recommendation[] = []

  // Growth Recommendations
  if (metrics?.revenueGrowth && metrics?.totalRevenue) {
    if (metrics.revenueGrowth < 10) {
      recommendations.push({
        id: "revenue-growth",
        title: "Revenue Growth Strategy",
        description: "Revenue growth is below target. Consider implementing pricing optimization, expanding marketing channels, or launching promotional campaigns to accelerate growth.",
        priority: "high",
        icon: <TrendingUp className="h-4 w-4" />,
        category: "growth"
      })
    }
  }

  // Risk Management
  if (metrics?.totalRevenue && metrics?.totalExpenses) {
    const profitMargin = ((metrics.totalRevenue - metrics.totalExpenses) / metrics.totalRevenue) * 100
    if (profitMargin < 15) {
      recommendations.push({
        id: "profit-margin",
        title: "Profit Margin Improvement",
        description: "Current profit margin is below industry standard. Review pricing strategy and identify cost reduction opportunities to improve profitability.",
        priority: "high",
        icon: <Target className="h-4 w-4" />,
        category: "risk"
      })
    }
  }

  // Cash Flow Management
  if (metrics?.cashFlow && metrics?.cashFlow < 0) {
    recommendations.push({
      id: "cash-flow",
      title: "Cash Flow Management",
      description: "Negative cash flow detected. Implement stricter payment collection policies and review payment terms with vendors to improve cash position.",
      priority: "high",
      icon: <DollarSign className="h-4 w-4" />,
      category: "risk"
    })
  }

  // Expense Optimization
  if (metrics?.operationalExpenses && metrics?.totalRevenue) {
    const expenseRatio = (metrics.operationalExpenses / metrics.totalRevenue) * 100
    if (expenseRatio > 70) {
      recommendations.push({
        id: "expense-optimization",
        title: "Expense Optimization",
        description: "Operating expenses are high relative to revenue. Review major expense categories and identify potential areas for cost reduction.",
        priority: "medium",
        icon: <BarChart3 className="h-4 w-4" />,
        category: "optimization"
      })
    }
  }

  // Revenue Diversification
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
      if (concentration > 50) {
        recommendations.push({
          id: "diversification",
          title: "Revenue Diversification",
          description: "High revenue concentration in a single category. Consider expanding into new markets or product lines to reduce dependency risk.",
          priority: "medium",
          icon: <ShieldCheck className="h-4 w-4" />,
          category: "risk"
        })
      }
    }
  }

  // Working Capital Optimization
  if (metrics?.currentAssets && metrics?.currentLiabilities) {
    const workingCapitalRatio = metrics.currentAssets / metrics.currentLiabilities
    if (workingCapitalRatio < 1.5) {
      recommendations.push({
        id: "working-capital",
        title: "Working Capital Management",
        description: "Working capital ratio is below optimal levels. Review inventory management and payment cycles to improve liquidity position.",
        priority: "medium",
        icon: <AlertCircle className="h-4 w-4" />,
        category: "optimization"
      })
    }
  }

  // Growth Opportunities
  if (transactions?.length && metrics?.totalRevenue) {
    const avgTransaction = metrics.totalRevenue / transactions.length
    if (avgTransaction < 500) {
      recommendations.push({
        id: "transaction-value",
        title: "Transaction Value Growth",
        description: "Average transaction value is low. Implement upselling strategies and premium offerings to increase revenue per transaction.",
        priority: "medium",
        icon: <ArrowUpRight className="h-4 w-4" />,
        category: "opportunity"
      })
    }
  }

  // Business Insights
  if (metrics?.totalRevenue && metrics?.revenueGrowth && metrics?.cashFlow) {
    recommendations.push({
      id: "business-insights",
      title: "Strategic Planning",
      description: "Regular financial review shows potential for optimization. Consider developing a comprehensive growth strategy aligned with current market conditions.",
      priority: "low",
      icon: <Lightbulb className="h-4 w-4" />,
      category: "opportunity"
    })
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50"
          >
            <div
              className={`rounded-full p-2 ${
                recommendation.priority === "high"
                  ? "bg-red-100 text-red-600"
                  : recommendation.priority === "medium"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-blue-100 text-blue-600"
              } ${
                recommendation.category === "growth"
                  ? "bg-green-100 text-green-600"
                  : recommendation.category === "risk"
                  ? "bg-red-100 text-red-600"
                  : recommendation.category === "optimization"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {recommendation.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{recommendation.title}</h4>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    recommendation.priority === "high"
                      ? "bg-red-100 text-red-600"
                      : recommendation.priority === "medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {recommendation.priority}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{recommendation.description}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
} 