"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building, CreditCard, DollarSign, Home, Info, PiggyBank, Scale, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FinancialBasicsStepProps {
  onNext: () => void
  onBack: () => void
}

export function FinancialBasicsStep({ onNext, onBack }: FinancialBasicsStepProps) {
  const [activeTab, setActiveTab] = useState("assets")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Financial Basics</h2>
        <p className="text-muted-foreground">Let's understand some key financial concepts before we begin</p>
      </div>

      <Card>
        <CardHeader className="bg-muted/50 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-primary" />
            The Accounting Equation
          </CardTitle>
          <CardDescription>The foundation of all accounting is this simple equation:</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center">
              <div className="text-xl font-medium sm:text-2xl">Assets = Liabilities + Equity</div>
              <p className="mt-2 text-sm text-muted-foreground">
                This equation is always in balance and forms the basis of your business's financial position
              </p>
            </div>

            <div className="mt-4 grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
              <motion.div
                className="flex flex-col items-center rounded-lg border bg-green-50 p-4 text-center dark:bg-green-950/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <PiggyBank className="h-8 w-8 text-green-600 dark:text-green-400" />
                <h3 className="mt-2 font-medium">Assets</h3>
                <p className="text-xs text-muted-foreground">What your business owns</p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center rounded-lg border bg-red-50 p-4 text-center dark:bg-red-950/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CreditCard className="h-8 w-8 text-red-600 dark:text-red-400" />
                <h3 className="mt-2 font-medium">Liabilities</h3>
                <p className="text-xs text-muted-foreground">What your business owes</p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center rounded-lg border bg-blue-50 p-4 text-center dark:bg-blue-950/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h3 className="mt-2 font-medium">Equity</h3>
                <p className="text-xs text-muted-foreground">The owner's stake in the business</p>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
          <TabsTrigger value="equity">Equity</TabsTrigger>
        </TabsList>
        <TabsContent value="assets" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-green-600" />
                Assets
              </CardTitle>
              <CardDescription>Assets are resources owned by your business that have economic value</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium">Examples of Assets:</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      Cash and bank accounts
                    </li>
                    <li className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-primary" />
                      Property and equipment
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Investments
                    </li>
                    <li className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary" />
                      Inventory and supplies
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium">Why Assets Matter:</h4>
                  <p className="mt-2 text-sm">
                    Assets generate income, provide operational capabilities, and represent the resources your business
                    can use to create value. Tracking assets helps you understand what your business owns and its
                    overall financial health.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="liabilities" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-red-600" />
                Liabilities
              </CardTitle>
              <CardDescription>Liabilities are financial obligations your business owes to others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium">Examples of Liabilities:</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      Credit card balances
                    </li>
                    <li className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary" />
                      Business loans
                    </li>
                    <li className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-primary" />
                      Mortgages
                    </li>
                    <li className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Unpaid bills and invoices
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium">Why Liabilities Matter:</h4>
                  <p className="mt-2 text-sm">
                    Tracking liabilities helps you understand your business's debt obligations and financial
                    commitments. Managing liabilities effectively is crucial for maintaining good cash flow and
                    financial stability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="equity" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                Equity
              </CardTitle>
              <CardDescription>Equity represents the owner's stake in the business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium">Examples of Equity:</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Owner's investments
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Retained earnings
                    </li>
                    <li className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary" />
                      Partner contributions
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium">Why Equity Matters:</h4>
                  <p className="mt-2 text-sm">
                    Equity shows the net value of your business to its owners. It's calculated as Assets minus
                    Liabilities. Tracking equity helps you understand how much of your business truly belongs to you
                    versus creditors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={onNext} className="mt-4">
          I Understand, Let's Continue
        </Button>
      </div>
    </div>
  )
}

