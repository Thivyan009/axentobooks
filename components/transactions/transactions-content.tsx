"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, BarChart3, FileText, Plus, Search, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/transactions/data-table"
import { columns } from "@/components/transactions/columns"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import type { Transaction } from "@/lib/types"
import { TransactionsLoading } from "./transactions-loading"
import { useQuery } from "@tanstack/react-query"
import { getTransactions, getFinancialMetrics } from "@/lib/actions/transactions"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TransactionsContentProps {
  initialTransactions: Transaction[]
}

export function TransactionsContent({ initialTransactions }: TransactionsContentProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")
  const router = useRouter()
  const { selectedCurrency } = useCurrencyStore()

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", date?.from, date?.to],
    queryFn: async () => {
      const result = await getTransactions()
      if (result.error) {
        throw new Error(result.error)
      }
      return result.transactions || []
    },
    initialData: initialTransactions,
    refetchInterval: 5000,
    staleTime: 0,
  })

  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ["metrics", date?.from, date?.to],
    queryFn: async () => {
      const result = await getFinancialMetrics()
      if (result.error) {
        throw new Error(result.error)
      }
      return result.metrics
    },
  })

  const handleCreateTransaction = () => {
    router.push("/dashboard")
  }

  if (transactionsLoading) {
    return <TransactionsLoading />
  }

  // Filter transactions based on search and type
  const filteredTransactions = transactionsData?.filter(transaction => {
    const matchesSearch = searchQuery === "" || 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type.toLowerCase() === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="container mx-auto max-w-7xl p-4">
      {/* Header Section */}
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex justify-end">
          <Button onClick={handleCreateTransaction} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Revenue</CardTitle>
              <ArrowUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {metricsLoading ? "..." : formatCurrency(metricsData?.totalRevenue || 0, selectedCurrency.code)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">Expenses</CardTitle>
              <ArrowDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                {metricsLoading ? "..." : formatCurrency(metricsData?.totalExpenses || 0, selectedCurrency.code)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Net Profit</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {metricsLoading ? "..." : formatCurrency(metricsData?.cashFlow || 0, selectedCurrency.code)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">Total</CardTitle>
              <FileText className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {transactionsLoading ? "..." : filteredTransactions?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction Analysis Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Transaction Analysis</CardTitle>
              <p className="text-xs text-muted-foreground">
                Detailed breakdown of all transactions
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <DatePickerWithRange date={date} setDate={setDate} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="text-xs">Transaction Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                    All Transactions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter("income")}>
                    Income Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter("expense")}>
                    Expenses Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Income
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Expenses
              </Badge>
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <DataTable columns={columns} data={filteredTransactions} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

