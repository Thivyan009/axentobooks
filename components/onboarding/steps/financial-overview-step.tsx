"use client"

import { ChevronLeft, ChevronRight, CreditCard, Wallet, PiggyBank, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Asset } from "@/lib/types/onboarding"

interface FinancialOverviewStepProps {
  assets: Asset[]
  liabilities: any[]
  equity: any[]
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  onNext: () => void
  onBack: () => void
}

export function FinancialOverviewStep({
  assets,
  liabilities,
  equity,
  totalAssets,
  totalLiabilities,
  netWorth,
  onNext,
  onBack,
}: FinancialOverviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Financial Overview</h2>
        <p className="text-muted-foreground">Here's a summary of your business's financial information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="bg-green-50 dark:bg-green-950/30 pb-2">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CreditCard className="h-5 w-5" />
              Assets
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">What your business owns</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">${totalAssets.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {assets.length} item{assets.length !== 1 ? "s" : ""} added
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="bg-red-50 dark:bg-red-950/30 pb-2">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <Wallet className="h-5 w-5" />
              Liabilities
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">What your business owes</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              ${totalLiabilities.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {liabilities.length} item{liabilities.length !== 1 ? "s" : ""} added
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/30 pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <PiggyBank className="h-5 w-5" />
              Equity
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-400">Your business's net worth</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">${netWorth.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">Assets - Liabilities</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>The Accounting Equation</CardTitle>
          <CardDescription>
            This fundamental equation shows the relationship between assets, liabilities, and equity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
                  <span className="font-bold text-green-700 dark:text-green-300">Assets</span>
                  <span className="ml-2 text-green-700 dark:text-green-300">${totalAssets.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center">
                <ArrowRight className="mx-2 h-5 w-5 hidden md:block" />
                <span className="md:hidden">−</span>
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-md">
                  <span className="font-bold text-red-700 dark:text-red-300">Liabilities</span>
                  <span className="ml-2 text-red-700 dark:text-red-300">${totalLiabilities.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center">
                <span className="mx-2">=</span>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                  <span className="font-bold text-blue-700 dark:text-blue-300">Equity</span>
                  <span className="ml-2 text-blue-700 dark:text-blue-300">${netWorth.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

