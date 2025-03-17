"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, BarChart3, Download, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/transactions/data-table"
import { columns } from "@/components/transactions/columns"
import { MonthSelect } from "@/components/analytics/month-select"
import { StatementDialog } from "@/components/profit-loss/statement-dialog"
import { useTransactions } from "@/hooks/use-transactions"
import { exportTransactionsToCSV } from "@/lib/utils/export"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import { getMonthName } from "@/lib/utils/date"
import type { Transaction } from "@/lib/types"
import { TransactionsLoading } from "./transactions-loading"
import { useQuery } from "@tanstack/react-query"
import { getTransactions } from "@/lib/actions/transactions"

interface TransactionsContentProps {
  initialTransactions?: Transaction[]
  error?: string
}

export function TransactionsContent({ initialTransactions = [], error: initialError }: TransactionsContentProps) {
  const router = useRouter()
  const { selectedCurrency } = useCurrencyStore()
  const [showStatementDialog, setShowStatementDialog] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  // Use React Query for real-time transaction data
  const { data: transactionsData, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const result = await getTransactions()
      if (result.error) throw new Error(result.error)
      return result.transactions
    },
    initialData: initialTransactions,
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 0, // Consider data stale immediately
  })

  const allTransactions = transactionsData || initialTransactions

  // Filter transactions by selected month
  const transactions = allTransactions.filter((transaction) => {
    if (!transaction.date) return false
    const transactionDate = new Date(transaction.date)
    // Ensure the date is valid
    if (isNaN(transactionDate.getTime())) return false
    
    const [year, month] = selectedMonth.split('-')
    return (
      transactionDate.getFullYear() === parseInt(year) &&
      transactionDate.getMonth() + 1 === parseInt(month)
    )
  })

  // Calculate totals from filtered transactions
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const netAmount = totalIncome - totalExpenses

  // Handle errors
  if (initialError || error) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Error</h3>
          <p className="text-sm text-muted-foreground">{initialError || error?.message}</p>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return <TransactionsLoading />
  }

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">Manage and track your financial transactions</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => exportTransactionsToCSV(allTransactions)}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => router.push("/transactions/new")}>
              Add Transaction
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <ArrowUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(totalIncome, selectedCurrency.code)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ArrowDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {formatCurrency(totalExpenses, selectedCurrency.code)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
              <Wallet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netAmount >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatCurrency(netAmount, selectedCurrency.code)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <MonthSelect value={selectedMonth} onValueChange={setSelectedMonth} />
            <p className="text-sm text-muted-foreground">
              {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} in {getMonthName(new Date(selectedMonth + "-01"))}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowStatementDialog(true)}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Statement
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <DataTable
          columns={columns}
          data={transactions}
          isLoading={isLoading}
        />
      </div>

      <StatementDialog
        open={showStatementDialog}
        onOpenChange={setShowStatementDialog}
        transactions={transactions}
      />
    </main>
  )
}

