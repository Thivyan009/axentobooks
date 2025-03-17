"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionTable } from "./transaction-table"
import type { DateRange } from "react-day-picker"

interface TransactionsTabProps {
  dateRange?: DateRange
}

export function TransactionsTab({ dateRange }: TransactionsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable dateRange={dateRange} />
        </CardContent>
      </Card>
    </div>
  )
} 