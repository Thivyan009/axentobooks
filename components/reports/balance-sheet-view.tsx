import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { BalanceSheet } from "@/lib/types/reports"

interface BalanceSheetViewProps {
  statement: BalanceSheet
}

export function BalanceSheetView({ statement }: BalanceSheetViewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
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
            {statement.assets.map((asset, i) => (
              <div key={i}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{asset.category}</span>
                  <span>{formatCurrency(asset.amount)}</span>
                </div>
                <Progress value={(asset.amount / statement.summary.totalAssets) * 100} className="h-2" />
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
        </CardContent>
      </Card>

      {/* Liabilities Section */}
      <Card>
        <CardHeader>
          <CardTitle>Liabilities</CardTitle>
          <CardDescription>Liability breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statement.liabilities.map((liability, i) => (
              <div key={i}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{liability.category}</span>
                  <span>{formatCurrency(liability.amount)}</span>
                </div>
                <Progress value={(liability.amount / statement.summary.totalLiabilities) * 100} className="h-2" />
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
            {statement.equity.map((eq, i) => (
              <div key={i}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{eq.category}</span>
                  <span>{formatCurrency(eq.amount)}</span>
                </div>
                <Progress value={(eq.amount / statement.summary.totalEquity) * 100} className="h-2" />
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
        </CardContent>
      </Card>

      {/* Analysis Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {statement.analysis.insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {statement.analysis.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {statement.analysis.riskFactors.map((risk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-sm">{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

