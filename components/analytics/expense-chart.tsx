"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { getTransactions } from "@/lib/actions/transactions"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import type { DateRange } from "react-day-picker"

interface ExpenseChartProps {
  dateRange?: DateRange
}

interface MonthlyData {
  month: string
  expenses: number
}

export function ExpenseChart({ dateRange }: ExpenseChartProps) {
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

  // Process transactions to get monthly expense data
  const monthlyData = transactionsData?.reduce((acc: MonthlyData[], transaction) => {
    if (transaction.type !== "expense") return acc

    const date = new Date(transaction.date)
    const month = date.toLocaleString('default', { month: 'short' })
    
    const existingMonth = acc.find(item => item.month === month)
    if (existingMonth) {
      existingMonth.expenses += transaction.amount
    } else {
      acc.push({ month, expenses: transaction.amount })
    }
    
    return acc
  }, []) || []

  // Sort by month
  const sortedData = monthlyData.sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.indexOf(a.month) - months.indexOf(b.month)
  })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading expense data...</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={sortedData}>
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value, selectedCurrency.code)}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
                      <span className="font-bold">{payload[0].payload.month}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Expenses</span>
                      <span className="font-bold">{formatCurrency(payload[0].value, selectedCurrency.code)}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="expenses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

