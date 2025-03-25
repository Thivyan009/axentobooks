import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { BalanceSheet } from "@/lib/types/reports"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import React from "react"

interface BalanceSheetViewProps {
  statement: BalanceSheet
}

export function BalanceSheetView({ statement }: BalanceSheetViewProps) {
  const [viewMode, setViewMode] = useState<'default' | 'word'>('default')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const renderDefaultView = () => (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === 'default' ? 'word' : 'default')}
        >
          {viewMode === 'default' ? 'Switch to Word Format' : 'Switch to Default View'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(statement.summary.totalAssets)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(statement.summary.totalLiabilities)}</div>
            <Progress
              value={(statement.summary.totalLiabilities / statement.summary.totalAssets) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(statement.summary.totalEquity)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Ratios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs">
                Current Ratio: <span className="font-bold">{statement.summary.currentRatio.toFixed(2)}</span>
              </div>
              <div className="text-xs">
                Debt to Equity: <span className="font-bold">{statement.summary.debtToEquityRatio.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assets Section */}
      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
          <CardDescription>Asset breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statement.assets.map((asset) => (
              <div key={`asset-${asset.category}`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{asset.category}</span>
                  <span>{formatCurrency(asset.amount)}</span>
                </div>
                <Progress value={(asset.amount / statement.summary.totalAssets) * 100} className="h-2" />
                <div className="mt-2 space-y-1">
                  {asset.items.map((item) => (
                    <div key={`asset-item-${item.description}`} className="flex justify-between text-sm text-muted-foreground">
                      <span>{item.description}</span>
                      <span>{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liabilities Section */}
      <Card>
        <CardHeader>
          <CardTitle>Liabilities</CardTitle>
          <CardDescription>Liabilities breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statement.liabilities.map((liability) => (
              <div key={`liability-${liability.category}`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{liability.category}</span>
                  <span>{formatCurrency(liability.amount)}</span>
                </div>
                <Progress value={(liability.amount / statement.summary.totalLiabilities) * 100} className="h-2" />
                <div className="mt-2 space-y-1">
                  {liability.items.map((item) => (
                    <div key={`liability-item-${item.description}`} className="flex justify-between text-sm text-muted-foreground">
                      <span>{item.description}</span>
                      <span>{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Equity</CardTitle>
          <CardDescription>Equity breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statement.equity.map((eq) => (
              <div key={`equity-${eq.category}`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{eq.category}</span>
                  <span>{formatCurrency(eq.amount)}</span>
                </div>
                <Progress value={(eq.amount / statement.summary.totalEquity) * 100} className="h-2" />
                <div className="mt-2 space-y-1">
                  {eq.items.map((item) => (
                    <div key={`equity-item-${item.description}`} className="flex justify-between text-sm text-muted-foreground">
                      <span>{item.description}</span>
                      <span>{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderWordView = () => (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === 'default' ? 'word' : 'default')}
        >
          {viewMode === 'default' ? 'Switch to Word Format' : 'Switch to Default View'}
        </Button>
      </div>

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
          {statement.assets.map((asset) => (
            <React.Fragment key={`word-asset-${asset.category}`}>
              <TableRow>
                <TableCell className="font-medium">{asset.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(asset.amount)}</TableCell>
              </TableRow>
              {asset.items.map((item) => (
                <TableRow key={`word-asset-item-${item.description}`}>
                  <TableCell className="pl-8">{item.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}

          {/* Liabilities Section */}
          <TableRow>
            <TableCell colSpan={2} className="font-semibold bg-muted">Liabilities</TableCell>
          </TableRow>
          {statement.liabilities.map((liability) => (
            <React.Fragment key={`word-liability-${liability.category}`}>
              <TableRow>
                <TableCell className="font-medium">{liability.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(liability.amount)}</TableCell>
              </TableRow>
              {liability.items.map((item) => (
                <TableRow key={`word-liability-item-${item.description}`}>
                  <TableCell className="pl-8">{item.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}

          {/* Equity Section */}
          <TableRow>
            <TableCell colSpan={2} className="font-semibold bg-muted">Equity</TableCell>
          </TableRow>
          {statement.equity.map((eq) => (
            <React.Fragment key={`word-equity-${eq.category}`}>
              <TableRow>
                <TableCell className="font-medium">{eq.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(eq.amount)}</TableCell>
              </TableRow>
              {eq.items.map((item) => (
                <TableRow key={`word-equity-item-${item.description}`}>
                  <TableCell className="pl-8">{item.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}

          {/* Summary Section */}
          <TableRow>
            <TableCell colSpan={2} className="font-semibold bg-muted">Summary</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Assets</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(statement.summary.totalAssets)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Liabilities</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(statement.summary.totalLiabilities)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Equity</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(statement.summary.totalEquity)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Current Ratio</TableCell>
            <TableCell className="text-right font-bold">{statement.summary.currentRatio?.toFixed(2) ?? 'N/A'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Debt to Equity Ratio</TableCell>
            <TableCell className="text-right font-bold">{statement.summary.debtToEquityRatio?.toFixed(2) ?? 'N/A'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      {viewMode === 'default' ? renderDefaultView() : renderWordView()}
    </div>
  )
}

