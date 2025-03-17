"use client"

import { useQuery } from "@tanstack/react-query"
import { getTransactions } from "@/lib/actions/transactions"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import type { DateRange } from "react-day-picker"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface TransactionTrendsProps {
  dateRange?: DateRange
}

interface MonthlyData {
  month: string
  income: number
  expenses: number
  net: number
}

export function TransactionTrends({ dateRange }: TransactionTrendsProps) {
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

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading trends...</div>
      </div>
    )
  }

  // Process transactions into monthly data
  const monthlyData = transactionsData?.reduce<MonthlyData[]>((acc, transaction) => {
    const date = new Date(transaction.date)
    const month = date.toLocaleString('default', { month: 'short', year: 'numeric' })
    
    const existingMonth = acc.find(m => m.month === month)
    if (existingMonth) {
      if (transaction.type === 'income') {
        existingMonth.income += transaction.amount
      } else {
        existingMonth.expenses += transaction.amount
      }
      existingMonth.net = existingMonth.income - existingMonth.expenses
    } else {
      acc.push({
        month,
        income: transaction.type === 'income' ? transaction.amount : 0,
        expenses: transaction.type === 'expense' ? transaction.amount : 0,
        net: transaction.type === 'income' ? transaction.amount : -transaction.amount,
      })
    }
    return acc
  }, []).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()) || []

  const formatValue = (value: number) => formatCurrency(value, selectedCurrency.code)

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatValue} />
          <Tooltip
            formatter={(value: number) => [formatValue(value), '']}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e" }}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: "#ef4444" }}
            name="Expenses"
          />
          <Line
            type="monotone"
            dataKey="net"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6" }}
            name="Net"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

