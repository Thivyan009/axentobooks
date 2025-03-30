'use client';

import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ProfitLossStatement } from "@/lib/types/ai"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import React from "react"

interface StatementViewProps {
  statement: ProfitLossStatement
}

export function StatementView({ statement }: StatementViewProps) {
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
            {statement.revenue.map((rev) => (
              <div key={`rev-${rev.category}`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{rev.category}</span>
                  <span>{formatCurrency(rev.amount)}</span>
                </div>
                <Progress value={(rev.amount / statement.summary.totalRevenue) * 100} className="h-2" />
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
            {statement.expenses.map((exp) => (
              <div key={`exp-${exp.category}`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{exp.category}</span>
                  <span>{formatCurrency(exp.amount)}</span>
                </div>
                <Progress value={(exp.amount / statement.summary.totalExpenses) * 100} className="h-2" />
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
              {statement.analysis.insights.map((insight) => (
                <li key={`insight-${insight}`} className="flex items-start gap-2">
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
              {statement.analysis.recommendations.map((rec) => (
                <li key={`rec-${rec}`} className="flex items-start gap-2">
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
              {statement.analysis.riskFactors.map((risk) => (
                <li key={`risk-${risk}`} className="flex items-start gap-2">
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
              {statement.analysis.opportunities.map((opp) => (
                <li key={`opp-${opp}`} className="flex items-start gap-2">
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
          {/* Revenue Section */}
          <TableRow>
            <TableCell colSpan={2} className="font-semibold bg-muted">Revenue</TableCell>
          </TableRow>
          {statement.revenue.map((rev) => (
            <React.Fragment key={`word-rev-${rev.category}`}>
              <TableRow>
                <TableCell className="font-medium">{rev.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(rev.amount)}</TableCell>
              </TableRow>
              {rev.items.map((item) => (
                <TableRow key={`word-rev-item-${item.description}`}>
                  <TableCell className="pl-8">{item.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}

          {/* Expenses Section */}
          <TableRow>
            <TableCell colSpan={2} className="font-semibold bg-muted">Expenses</TableCell>
          </TableRow>
          {statement.expenses.map((exp) => (
            <React.Fragment key={`word-exp-${exp.category}`}>
              <TableRow>
                <TableCell className="font-medium">{exp.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(exp.amount)}</TableCell>
              </TableRow>
              {exp.items.map((item) => (
                <TableRow key={`word-exp-item-${item.description}`}>
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
            <TableCell>Total Revenue</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(statement.summary.totalRevenue)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Expenses</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(statement.summary.totalExpenses)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Net Profit/Loss</TableCell>
            <TableCell className={`text-right font-bold ${statement.summary.netProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(statement.summary.netProfitLoss)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Profit Margin</TableCell>
            <TableCell className="text-right font-bold">{statement.summary.profitMargin.toFixed(2)}%</TableCell>
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

