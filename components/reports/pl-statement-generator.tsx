"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { getMonthlyTransactions, generatePLStatement, savePLStatement } from "@/lib/actions/reports"
import { Loader2 } from "lucide-react"

interface PLStatement {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  revenueBreakdown: Record<string, number>
  expenseBreakdown: Record<string, number>
  summary: string
}

export function PLStatementGenerator() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isGenerating, setIsGenerating] = useState(false)
  const [statement, setStatement] = useState<PLStatement | null>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      
      // Fetch transactions for the selected month
      const transactions = await getMonthlyTransactions(selectedDate)
      
      if (transactions.length === 0) {
        toast({
          title: "No transactions found",
          description: "There are no transactions for the selected month.",
          variant: "destructive",
        })
        return
      }

      // Generate P&L statement using Gemini AI
      const plData = await generatePLStatement(transactions)
      
      // Save the statement
      await savePLStatement(plData, selectedDate)
      
      setStatement(plData)
      
      toast({
        title: "P&L Statement Generated",
        description: "Your profit and loss statement has been generated successfully.",
      })
    } catch (error) {
      console.error("Error generating P&L statement:", error)
      toast({
        title: "Error",
        description: "Failed to generate P&L statement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate P&L Statement</CardTitle>
          <CardDescription>
            Select a month to generate a profit and loss statement from your transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Statement"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {statement && (
        <Card>
          <CardHeader>
            <CardTitle>
              P&L Statement - {format(selectedDate, "MMMM yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${statement.totalRevenue.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    ${statement.totalExpenses.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${statement.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${statement.netProfit.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(statement.revenueBreakdown).map(([category, amount]) => (
                      <div key={category} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{category}</span>
                        <span className="font-medium text-green-600">${amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(statement.expenseBreakdown).map(([category, amount]) => (
                      <div key={category} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{category}</span>
                        <span className="font-medium text-red-600">${amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{statement.summary}</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 