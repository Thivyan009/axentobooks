import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ProfitLossStatement, BalanceSheet } from "@/lib/types/reports"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, AlertCircle, Lightbulb } from "lucide-react"
import { formatCurrency } from "@/lib/utils/currency"

interface CFAReportProps {
  plStatement: ProfitLossStatement
  balanceSheet: BalanceSheet
}

export function CFAReport({ plStatement, balanceSheet }: CFAReportProps) {
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
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

  // Calculate financial ratios with fallbacks
  const currentRatio = balanceSheet.summary.currentRatio ?? 
    (balanceSheet.summary.totalAssets > 0 ? 
      (balanceSheet.assets.find(a => a.category === "Current Assets")?.amount ?? 0) / 
      (balanceSheet.liabilities.find(l => l.category === "Current Liabilities")?.amount ?? 1) : 0)

  const debtToEquityRatio = balanceSheet.summary.debtToEquityRatio ?? 
    (balanceSheet.summary.totalEquity > 0 ? 
      balanceSheet.summary.totalLiabilities / balanceSheet.summary.totalEquity : 0)

  // Calculate additional financial ratios
  const grossProfitMargin = ((plStatement.summary.totalRevenue - plStatement.expenses.find(e => e.category === "Cost of Goods Sold")?.amount ?? 0) / plStatement.summary.totalRevenue) * 100
  const operatingMargin = ((plStatement.summary.netProfitLoss + (plStatement.expenses.find(e => e.category === "Operating Expenses")?.amount ?? 0)) / plStatement.summary.totalRevenue) * 100
  const returnOnAssets = (plStatement.summary.netProfitLoss / balanceSheet.summary.totalAssets) * 100
  const returnOnEquity = (plStatement.summary.netProfitLoss / balanceSheet.summary.totalEquity) * 100
  const assetTurnover = plStatement.summary.totalRevenue / balanceSheet.summary.totalAssets
  const inventoryTurnover = plStatement.summary.totalRevenue / (balanceSheet.assets.find(a => a.category === "Current Assets")?.items.find(i => i.description === "Inventory")?.amount ?? 1)
  const workingCapital = (balanceSheet.assets.find(a => a.category === "Current Assets")?.amount ?? 0) - 
                        (balanceSheet.liabilities.find(l => l.category === "Current Liabilities")?.amount ?? 0)

  // Calculate trend indicators
  const revenueTrend = plStatement.summary.monthOverMonthGrowth > 0 ? "positive" : "negative"
  const profitTrend = plStatement.summary.netProfitLoss > 0 ? "positive" : "negative"
  const liquidityTrend = currentRatio > 2 ? "strong" : currentRatio > 1 ? "adequate" : "weak"
  const solvencyTrend = debtToEquityRatio < 1 ? "strong" : debtToEquityRatio < 2 ? "adequate" : "weak"

  return (
    <div className="space-y-6">
      {/* Executive Summary with Enhanced Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>Key Financial Metrics and Analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Revenue Growth</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{formatPercentage(plStatement.summary.monthOverMonthGrowth)}</p>
                {revenueTrend === "positive" ? (
                  <ArrowUpRight className="ml-2 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="ml-2 h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{formatPercentage(plStatement.summary.profitMargin)}</p>
                {profitTrend === "positive" ? (
                  <TrendingUp className="ml-2 h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="ml-2 h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Current Ratio</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{currentRatio.toFixed(2)}</p>
                <span className={`ml-2 text-sm ${liquidityTrend === "strong" ? "text-green-500" : liquidityTrend === "adequate" ? "text-yellow-500" : "text-red-500"}`}>
                  {liquidityTrend}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Debt/Equity</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{debtToEquityRatio.toFixed(2)}</p>
                <span className={`ml-2 text-sm ${solvencyTrend === "strong" ? "text-green-500" : solvencyTrend === "adequate" ? "text-yellow-500" : "text-red-500"}`}>
                  {solvencyTrend}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profit & Loss Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement</CardTitle>
          <CardDescription>
            Period: {formatDate(plStatement.periodStart)} to {formatDate(plStatement.periodEnd)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Revenue Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Revenue</h3>
              <div className="space-y-4">
                {plStatement.revenue.map((rev, i) => (
                  <div key={i}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{rev.category}</span>
                      <span>{formatCurrency(rev.amount)}</span>
                    </div>
                    <Progress 
                      value={(rev.amount / plStatement.summary.totalRevenue) * 100} 
                      className="h-2"
                    />
                    <div className="mt-2 space-y-1">
                      {rev.items.map((item, j) => (
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

            {/* Expenses Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Expenses</h3>
              <div className="space-y-4">
                {plStatement.expenses.map((exp, i) => (
                  <div key={i}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{exp.category}</span>
                      <span>{formatCurrency(exp.amount)}</span>
                    </div>
                    <Progress 
                      value={(exp.amount / plStatement.summary.totalExpenses) * 100} 
                      className="h-2"
                    />
                    <div className="mt-2 space-y-1">
                      {exp.items.map((item, j) => (
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
                  <span className="font-bold">{formatPercentage(plStatement.summary.profitMargin)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance Sheet */}
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet</CardTitle>
          <CardDescription>As of {formatDate(balanceSheet.date)}</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <span className="font-bold">{currentRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Debt to Equity Ratio</span>
                  <span className="font-bold">{debtToEquityRatio.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Analysis</CardTitle>
          <CardDescription>Comprehensive Financial Analysis and Strategic Insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Performance Metrics */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Performance Metrics</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Gross Profit Margin</p>
                  <p className="text-2xl font-bold">{formatPercentage(grossProfitMargin)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {grossProfitMargin > 50 ? "Strong" : grossProfitMargin > 30 ? "Adequate" : "Needs Improvement"}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Operating Margin</p>
                  <p className="text-2xl font-bold">{formatPercentage(operatingMargin)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {operatingMargin > 20 ? "Strong" : operatingMargin > 10 ? "Adequate" : "Needs Improvement"}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Return on Assets</p>
                  <p className="text-2xl font-bold">{formatPercentage(returnOnAssets)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {returnOnAssets > 15 ? "Strong" : returnOnAssets > 8 ? "Adequate" : "Needs Improvement"}
                  </p>
                </div>
              </div>
            </div>

            {/* Efficiency Metrics */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Efficiency Metrics</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Asset Turnover</p>
                  <p className="text-2xl font-bold">{assetTurnover.toFixed(2)}x</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {assetTurnover > 2 ? "Efficient" : assetTurnover > 1 ? "Adequate" : "Needs Improvement"}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Inventory Turnover</p>
                  <p className="text-2xl font-bold">{inventoryTurnover.toFixed(2)}x</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {inventoryTurnover > 6 ? "Efficient" : inventoryTurnover > 3 ? "Adequate" : "Needs Improvement"}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Working Capital</p>
                  <p className="text-2xl font-bold">{formatCurrency(workingCapital)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {workingCapital > 0 ? "Positive" : "Negative"}
                  </p>
                </div>
              </div>
            </div>

            {/* Strategic Insights */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Strategic Insights</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
                  <div>
                    <p className="font-medium">Growth Opportunities</p>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {plStatement.analysis.opportunities.map((opp, i) => (
                        <li key={i}>{opp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium">Risk Assessment</p>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {balanceSheet.analysis.riskFactors.map((risk, i) => (
                        <li key={i}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Actionable Recommendations</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Short-term Actions</h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {balanceSheet.analysis.recommendations
                      .filter(rec => rec.toLowerCase().includes("immediate") || rec.toLowerCase().includes("short-term"))
                      .map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                  </ul>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Long-term Strategy</h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {balanceSheet.analysis.recommendations
                      .filter(rec => !rec.toLowerCase().includes("immediate") && !rec.toLowerCase().includes("short-term"))
                      .map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Industry Comparison */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Industry Comparison</h3>
              <div className="rounded-lg border p-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profit Margin vs Industry</p>
                    <p className="text-2xl font-bold">{formatPercentage(plStatement.summary.profitMargin)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {plStatement.summary.profitMargin > 20 ? "Above Industry Average" : "Below Industry Average"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Ratio vs Industry</p>
                    <p className="text-2xl font-bold">{currentRatio.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {currentRatio > 2 ? "Above Industry Average" : "Below Industry Average"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Debt/Equity vs Industry</p>
                    <p className="text-2xl font-bold">{debtToEquityRatio.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {debtToEquityRatio < 1 ? "Below Industry Average" : "Above Industry Average"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 