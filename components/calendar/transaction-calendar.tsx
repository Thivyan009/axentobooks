"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { getTransactions } from "@/lib/actions/transactions"
import { Transaction } from "@/lib/types"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import { ArrowDown, ArrowUp, Calendar as CalendarIcon, DollarSign, Receipt } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function TransactionCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const { selectedCurrency } = useCurrencyStore()

  const { data: transactionsData, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      try {
        const result = await getTransactions()
        if (result.error) {
          throw new Error(result.error)
        }
        return result.transactions || []
      } catch (error) {
        console.error("Error fetching transactions:", error)
        throw error
      }
    },
    retry: false,
  })

  const getTransactionsForDate = (date: Date) => {
    if (!transactionsData) return []
    return transactionsData.filter((transaction) => {
      const transactionDate = new Date(transaction.date)
      return (
        transactionDate.getDate() === date.getDate() &&
        transactionDate.getMonth() === date.getMonth() &&
        transactionDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const getDateTotal = (date: Date) => {
    const transactions = getTransactionsForDate(date)
    return transactions.reduce((acc, transaction) => {
      return acc + (transaction.type === "income" ? transaction.amount : -transaction.amount)
    }, 0)
  }

  const selectedTransactions = selectedDate ? getTransactionsForDate(selectedDate) : []
  const selectedDateTotal = selectedDate ? getDateTotal(selectedDate) : 0

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load transactions. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Transaction Calendar</h2>
          <p className="text-sm text-muted-foreground">
            View and manage your transactions by date
          </p>
        </div>
        <Badge variant={selectedDateTotal >= 0 ? "success" : "destructive"} className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          {formatCurrency(Math.abs(selectedDateTotal), selectedCurrency.code)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                const now = new Date();
                const twelveMonthsAgo = new Date();
                twelveMonthsAgo.setMonth(now.getMonth() - 12);
                return date > now || date < twelveMonthsAgo;
              }}
              className="rounded-md border"
              modifiers={{
                hasTransactions: (date) => getTransactionsForDate(date).length > 0,
                positiveDay: (date) => getDateTotal(date) > 0,
                negativeDay: (date) => getDateTotal(date) < 0,
              }}
              modifiersStyles={{
                hasTransactions: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                },
                positiveDay: {
                  color: "rgb(34 197 94)",
                },
                negativeDay: {
                  color: "rgb(239 68 68)",
                },
              }}
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                  "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                  "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                ),
                day_range_end: "day-range-end",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside:
                  "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                  "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Transactions for {selectedDate ? format(selectedDate, "PPP") : "Selected Date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading transactions...</p>
                </div>
              ) : selectedTransactions.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No transactions for this date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedTransactions.map((transaction) => (
                    <div key={transaction.id}>
                      <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{transaction.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {transaction.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {transaction.paymentMethod}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {transaction.type === "income" ? (
                              <ArrowUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-red-600" />
                            )}
                            <p className={cn(
                              "font-medium",
                              transaction.type === "income" ? "text-green-600" : "text-red-600"
                            )}>
                              {formatCurrency(transaction.amount, selectedCurrency.code)}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), "h:mm a")}
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 