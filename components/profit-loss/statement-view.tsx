import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ProfitLossStatement } from "@/lib/types/ai"

interface StatementViewProps {
  statement: ProfitLossStatement
}

export function StatementView({ statement }: StatementViewProps) {
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(statement.summary.totalRevenue)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">{statement.summary.monthOverMonthGrowth}%</span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(statement.summary.totalExpenses)}</div>
            <Progress
              value={(statement.summary.totalExpenses / statement.summary.totalRevenue) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit/Loss</CardTitle>
            {statement.summary.netProfitLoss >= 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                statement.summary.netProfitLoss >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {formatCurrency(statement.summary.netProfitLoss)}
            </div>
            <div className="text-xs text-muted-foreground">Profit Margin: {statement.summary.profitMargin}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statement.summary.monthOverMonthGrowth}%</div>
            <div className="text-xs text-muted-foreground">Month over Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Section */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Revenue by category for the period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statement.revenue.map((rev, i) => (
              <div key={i}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{rev.category}</span>
                  <span>{formatCurrency(rev.amount)}</span>
                </div>
                <Progress value={(rev.amount / statement.summary.totalRevenue) * 100} className="h-2" />
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
        </CardContent>
      </Card>

      {/* Expenses Section */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Expenses by category for the period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statement.expenses.map((exp, i) => (
              <div key={i}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{exp.category}</span>
                  <span>{formatCurrency(exp.amount)}</span>
                </div>
                <Progress value={(exp.amount / statement.summary.totalExpenses) * 100} className="h-2" />
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
        </CardContent>
      </Card>

      {/* Analysis Section */}
      <div className="grid gap-4 md:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle>Growth Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {statement.analysis.opportunities.map((opp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">{opp}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

