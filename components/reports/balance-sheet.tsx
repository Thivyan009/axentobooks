import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { BalanceSheet } from "@/lib/types/reports"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"

interface BalanceSheetProps {
  balanceSheet: BalanceSheet
}

export function BalanceSheet({ balanceSheet }: BalanceSheetProps) {
  const [viewMode, setViewMode] = useState<'default' | 'word'>('default')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

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
      {/* Assets Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Assets</h3>
        <div className="space-y-4">
          {balanceSheet.assets.map((asset, i) => (
            <div key={i}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{asset.category}</span>
                <span>{formatCurrency(asset.amount)}</span>
              </div>
              <Progress 
                value={(asset.amount / balanceSheet.summary.totalAssets) * 100} 
                className="h-2"
              />
              <div className="mt-2 space-y-1">
                {asset.items.map((item, j) => (
                  <div key={j} className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.description}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Liabilities Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Liabilities</h3>
        <div className="space-y-4">
          {balanceSheet.liabilities.map((liability, i) => (
            <div key={i}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{liability.category}</span>
                <span>{formatCurrency(liability.amount)}</span>
              </div>
              <Progress 
                value={(liability.amount / balanceSheet.summary.totalLiabilities) * 100} 
                className="h-2"
              />
              <div className="mt-2 space-y-1">
                {liability.items.map((item, j) => (
                  <div key={j} className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.description}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equity Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Equity</h3>
        <div className="space-y-4">
          {balanceSheet.equity.map((eq, i) => (
            <div key={i}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{eq.category}</span>
                <span>{formatCurrency(eq.amount)}</span>
              </div>
              <Progress 
                value={(eq.amount / balanceSheet.summary.totalEquity) * 100} 
                className="h-2"
              />
              <div className="mt-2 space-y-1">
                {eq.items.map((item, j) => (
                  <div key={j} className="flex justify-between text-sm text-muted-foreground">
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
        <h3 className="mb-4 text-lg font-semibold">Financial Position Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Assets</span>
            <span className="font-bold">{formatCurrency(balanceSheet.summary.totalAssets)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Liabilities</span>
            <span className="font-bold">{formatCurrency(balanceSheet.summary.totalLiabilities)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Equity</span>
            <span className="font-bold">{formatCurrency(balanceSheet.summary.totalEquity)}</span>
          </div>
          <div className="flex justify-between">
            <span>Current Ratio</span>
            <span className="font-bold">{balanceSheet.summary.currentRatio?.toFixed(2) ?? 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Debt to Equity Ratio</span>
            <span className="font-bold">{balanceSheet.summary.debtToEquityRatio?.toFixed(2) ?? 'N/A'}</span>
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
          {/* Assets Section */}
          <TableRow>
            <TableCell colSpan={2} className="font-semibold bg-muted">Assets</TableCell>
          </TableRow>
          {balanceSheet.assets.map((asset, i) => (
            <>
              <TableRow key={i}>
                <TableCell className="font-medium">{asset.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(asset.amount)}</TableCell>
              </TableRow>
              {asset.items.map((item, j) => (
                <TableRow key={`${i}-${j}`}>
                  <TableCell className="pl-8">{item.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </>
          ))}

          {/* Liabilities Section */}
          <TableRow>
            <TableCell colSpan={2} className="font-semibold bg-muted">Liabilities</TableCell>
          </TableRow>
          {balanceSheet.liabilities.map((liability, i) => (
            <>
              <TableRow key={i}>
                <TableCell className="font-medium">{liability.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(liability.amount)}</TableCell>
              </TableRow>
              {liability.items.map((item, j) => (
                <TableRow key={`${i}-${j}`}>
                  <TableCell className="pl-8">{item.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </>
          ))}

          {/* Equity Section */}
          <TableRow>
            <TableCell colSpan={2} className="font-semibold bg-muted">Equity</TableCell>
          </TableRow>
          {balanceSheet.equity.map((eq, i) => (
            <>
              <TableRow key={i}>
                <TableCell className="font-medium">{eq.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(eq.amount)}</TableCell>
              </TableRow>
              {eq.items.map((item, j) => (
                <TableRow key={`${i}-${j}`}>
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
            <TableCell>Total Assets</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(balanceSheet.summary.totalAssets)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Liabilities</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(balanceSheet.summary.totalLiabilities)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Equity</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(balanceSheet.summary.totalEquity)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Current Ratio</TableCell>
            <TableCell className="text-right font-bold">{balanceSheet.summary.currentRatio?.toFixed(2) ?? 'N/A'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Debt to Equity Ratio</TableCell>
            <TableCell className="text-right font-bold">{balanceSheet.summary.debtToEquityRatio?.toFixed(2) ?? 'N/A'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Balance Sheet</CardTitle>
          <CardDescription>As of {formatDate(balanceSheet.date)}</CardDescription>
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