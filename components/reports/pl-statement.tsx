import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ProfitLossStatement } from "@/lib/types/reports"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils/currency"

interface PLStatementProps {
  plStatement: ProfitLossStatement
}

export function PLStatement({ plStatement }: PLStatementProps) {
  const [viewMode, setViewMode] = useState<'default' | 'word'>('default')

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (Number.isNaN(date.getTime())) {
        return "Invalid Date"
      }
      return format(date, "MMMM d, yyyy")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

  const renderDefaultView = () => (
    <div className="space-y-6">
      {/* Revenue Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Revenue</h3>
        <div className="space-y-4">
          {plStatement.revenue.map((rev, i) => (
            <div key={`rev-${rev.category}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{rev.category}</span>
                <span>{formatCurrency(rev.amount)}</span>
              </div>
              <Progress 
                value={(rev.amount / plStatement.summary.totalRevenue) * 100} 
                className="h-2"
              />
              <div className="mt-2 space-y-1">
                {rev.items.map((item) => (
                  <div key={`rev-item-${item.description}`} className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.description}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Expenses</h3>
        <div className="space-y-4">
          {plStatement.expenses.map((exp) => (
            <div key={`exp-${exp.category}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{exp.category}</span>
                <span>{formatCurrency(exp.amount)}</span>
              </div>
              <Progress 
                value={(exp.amount / plStatement.summary.totalExpenses) * 100} 
                className="h-2"
              />
              <div className="mt-2 space-y-1">
                {exp.items.map((item) => (
                  <div key={`exp-item-${item.description}`} className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.description}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="rounded-lg bg-muted p-4">
        <h3 className="mb-4 text-lg font-semibold">Financial Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Revenue</span>
            <span className="font-bold">{formatCurrency(plStatement.summary.totalRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Expenses</span>
            <span className="font-bold">{formatCurrency(plStatement.summary.totalExpenses)}</span>
          </div>
          <div className="flex justify-between">
            <span>Net Profit/Loss</span>
            <span className={`font-bold ${plStatement.summary.netProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(plStatement.summary.netProfitLoss)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Profit Margin</span>
            <span className="font-bold">{plStatement.summary.profitMargin.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderWordView = () => (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60%]">Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Revenue Section */}
          <TableRow>
            <TableCell colSpan={2} className="font-semibold bg-muted">Revenue</TableCell>
          </TableRow>
          {plStatement.revenue.map((rev) => (
            <>
              <TableRow key={`word-rev-${rev.category}`}>
                <TableCell className="font-medium">{rev.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(rev.amount)}</TableCell>
              </TableRow>
              {rev.items.map((item) => (
                <TableRow key={`word-rev-item-${item.description}`}>
                  <TableCell className="pl-8">{item.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </>
          ))}

          {/* Expenses Section */}
          <TableRow>
            <TableCell colSpan={2} className="font-semibold bg-muted">Expenses</TableCell>
          </TableRow>
          {plStatement.expenses.map((exp) => (
            <>
              <TableRow key={`word-exp-${exp.category}`}>
                <TableCell className="font-medium">{exp.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(exp.amount)}</TableCell>
              </TableRow>
              {exp.items.map((item) => (
                <TableRow key={`word-exp-item-${item.description}`}>
                  <TableCell className="pl-8">{item.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </>
          ))}

          {/* Summary Section */}
          <TableRow>
            <TableCell colSpan={2} className="font-semibold bg-muted">Summary</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Revenue</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(plStatement.summary.totalRevenue)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Expenses</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(plStatement.summary.totalExpenses)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Net Profit/Loss</TableCell>
            <TableCell className={`text-right font-bold ${plStatement.summary.netProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(plStatement.summary.netProfitLoss)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Profit Margin</TableCell>
            <TableCell className="text-right font-bold">{plStatement.summary.profitMargin.toFixed(2)}%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Profit & Loss Statement</CardTitle>
          <CardDescription>
            Period: {formatDate(plStatement.periodStart)} to {formatDate(plStatement.periodEnd)}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === 'default' ? 'word' : 'default')}
        >
          {viewMode === 'default' ? 'Switch to Word Format' : 'Switch to Default View'}
        </Button>
      </CardHeader>
      <CardContent>
        {viewMode === 'default' ? renderDefaultView() : renderWordView()}
      </CardContent>
    </Card>
  )
} 