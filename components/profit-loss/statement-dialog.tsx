"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Download, Loader2 } from "lucide-react"
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
import { StatementView } from "@/components/profit-loss/statement-view"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/lib/types"
import type { ProfitLossStatement } from "@/lib/types/ai"

interface StatementDialogProps {
  transactions: Transaction[]
}

export function StatementDialog({ transactions }: StatementDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [statement, setStatement] = useState<ProfitLossStatement | null>(null)
  const { toast } = useToast()

  const generateStatement = async () => {
    if (!date) {
      toast({
        title: "Select a month",
        description: "Please select a month to generate the statement.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Set the start and end dates for the selected month
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      // Filter transactions for the selected month
      const monthTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        return transactionDate >= startDate && transactionDate <= endDate
      })

      if (monthTransactions.length === 0) {
        throw new Error("No transactions found for the selected month")
      }

      const response = await fetch("/api/profit-loss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactions: monthTransactions,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate statement")
      }

      const result = await response.json()
      if (result.error) {
        throw new Error(result.error)
      }

      setStatement(result)
      toast({
        title: "Statement Generated",
        description: `P&L statement for ${format(date, "MMMM yyyy")} has been generated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate P&L statement",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadStatement = () => {
    if (!statement || !date) return

    const jsonString = JSON.stringify(statement, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pl-statement-${format(date, "yyyy-MM")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Generate P&L Statement</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Profit & Loss Statement</DialogTitle>
          <DialogDescription>
            Select a month to generate a detailed P&L statement with AI-powered insights.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM yyyy") : "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus disabled={loading} />
              </PopoverContent>
            </Popover>
            <Button onClick={generateStatement} disabled={!date || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
            {statement && (
              <Button variant="outline" onClick={downloadStatement} disabled={loading}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>

          {statement && <StatementView statement={statement} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

