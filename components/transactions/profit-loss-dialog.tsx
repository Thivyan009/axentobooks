"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/lib/types"
import type { ProfitLossStatement } from "@/lib/types/ai"

interface ProfitLossDialogProps {
  transactions: Transaction[]
}

export function ProfitLossDialog({ transactions }: ProfitLossDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [statement, setStatement] = useState<ProfitLossStatement | null>(null)

  const generateStatement = async () => {
    if (!date) return

    setLoading(true)
    try {
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const response = await fetch("/api/profit-loss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactions,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate statement")
      }

      const result = await response.json()
      setStatement(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Generate P&L Statement</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Profit & Loss Statement</DialogTitle>
          <DialogDescription>Select a month to generate the P&L statement.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM yyyy") : "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Button onClick={generateStatement} disabled={!date || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
          </div>

          {statement && (
            <div className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-semibold">Revenue</h3>
                <div className="space-y-4">
                  {statement.revenue.map((rev, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between font-medium">
                        <span>{rev.category}</span>
                        <span>${rev.amount.toFixed(2)}</span>
                      </div>
                      <div className="ml-4 space-y-1 text-sm text-muted-foreground">
                        {rev.items.map((item, j) => (
                          <div key={j} className="flex justify-between">
                            <span>{item.description}</span>
                            <span>${item.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-semibold">Expenses</h3>
                <div className="space-y-4">
                  {statement.expenses.map((exp, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between font-medium">
                        <span>{exp.category}</span>
                        <span>${exp.amount.toFixed(2)}</span>
                      </div>
                      <div className="ml-4 space-y-1 text-sm text-muted-foreground">
                        {exp.items.map((item, j) => (
                          <div key={j} className="flex justify-between">
                            <span>{item.description}</span>
                            <span>${item.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-semibold">Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-medium">${statement.summary.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses</span>
                    <span className="font-medium">${statement.summary.totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Net Profit/Loss</span>
                    <span
                      className={cn(
                        "font-medium",
                        statement.summary.netProfitLoss >= 0 ? "text-green-600" : "text-red-600",
                      )}
                    >
                      ${statement.summary.netProfitLoss.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin</span>
                    <span className="font-medium">{statement.summary.profitMargin.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-semibold">Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-medium">Key Insights</h4>
                    <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                      {statement.analysis.insights.map((insight, i) => (
                        <li key={i}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Recommendations</h4>
                    <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                      {statement.analysis.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

