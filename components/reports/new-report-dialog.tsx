"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { generatePLStatement, getMonthlyTransactions, savePLStatement } from "@/lib/actions/reports"
import { useRouter } from "next/navigation"

interface NewReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewReportDialog({ open, onOpenChange }: NewReportDialogProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [type, setType] = useState<"pl" | "balance">("pl")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      console.log("Starting report generation for date:", date.toISOString())
      
      if (type === "pl") {
        // Get transactions for the selected month
        console.log("Fetching transactions...")
        const transactions = await getMonthlyTransactions(date)
        
        if (!transactions || transactions.length === 0) {
          console.log("No transactions found for the selected month")
          toast({
            title: "No Transactions",
            description: "No transactions found for the selected month.",
            variant: "destructive",
          })
          return
        }

        console.log("Found transactions:", transactions.length)

        // Generate P&L statement
        console.log("Generating P&L statement...")
        const statement = await generatePLStatement(transactions)
        
        // Save the statement
        console.log("Saving P&L statement...")
        await savePLStatement(statement, date)

        console.log("Report generated successfully")
        toast({
          title: "Report Generated",
          description: "Your P&L statement has been generated successfully.",
        })
      } else {
        // TODO: Implement balance sheet generation
        toast({
          title: "Coming Soon",
          description: "Balance sheet generation will be available soon.",
        })
        return
      }

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error in handleGenerate:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate New Report</DialogTitle>
          <DialogDescription>
            Select a month and report type to generate a new financial report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={type} onValueChange={(value: "pl" | "balance") => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pl">Profit & Loss Statement</SelectItem>
                <SelectItem value="balance">Balance Sheet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Month</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 