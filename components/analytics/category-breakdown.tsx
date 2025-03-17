"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { getTransactions } from "@/lib/actions/transactions"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import type { DateRange } from "react-day-picker"

interface CategoryBreakdownProps {
  dateRange?: DateRange
}

interface CategoryData {
  name: string
  value: number
  percentage: number
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--destructive))",
  "hsl(var(--muted))",
  "hsl(var(--popover))",
  "hsl(var(--card))",
  "hsl(var(--border))",
  "hsl(var(--input))",
  "hsl(var(--ring))",
]

export function CategoryBreakdown({ dateRange }: CategoryBreakdownProps) {
  const { selectedCurrency } = useCurrencyStore()

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["transactions", dateRange?.from, dateRange?.to],
    queryFn: async () => {
      const result = await getTransactions()
      if (result.error) {
        throw new Error(result.error)
      }
      return result.transactions || []
    },
  })

  // Process transactions to get category breakdown
  const categoryData = transactionsData?.reduce((acc: CategoryData[], transaction) => {
    if (transaction.type !== "income") return acc

    const existingCategory = acc.find(item => item.name === transaction.category)
    if (existingCategory) {
      existingCategory.value += transaction.amount
    } else {
      acc.push({ name: transaction.category, value: transaction.amount, percentage: 0 })
    }
    
    return acc
  }, []) || []

  // Calculate total and percentages
  const total = categoryData.reduce((sum, item) => sum + item.value, 0)
  categoryData.forEach(item => {
    item.percentage = (item.value / total) * 100
  })

  // Sort by value descending
  categoryData.sort((a, b) => b.value - a.value)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading category data...</div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Category</span>
                          <span className="font-bold">{payload[0].payload.name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Amount</span>
                          <span className="font-bold">{formatCurrency(payload[0].value, selectedCurrency.code)}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Percentage</span>
                          <span className="font-bold">{payload[0].payload.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="space-y-2">
          {categoryData.map((category, index) => (
            <div key={`${category.name}-${index}`} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{category.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{formatCurrency(category.value, selectedCurrency.code)}</div>
                <div className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

