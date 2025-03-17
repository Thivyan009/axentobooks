"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, ChevronLeft, DollarSign, Building, Calculator, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface FinancialsBasicsStepProps {
  onNext: () => void
  onBack: () => void
}

export function FinancialsBasicsStep({ onNext, onBack }: FinancialsBasicsStepProps) {
  const [currentTab, setCurrentTab] = useState("assets")

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Financial Basics</h2>
        <p className="text-muted-foreground">
          Let's learn some basic financial concepts before we set up your business
        </p>
      </div>

      <div className="rounded-lg border bg-amber-50 p-4 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-amber-100 p-1 dark:bg-amber-900">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Why This Matters</h3>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Understanding these basic concepts will help you track your business finances more effectively. Don't
              worry - we've kept it simple!
            </p>
          </div>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
          <TabsTrigger value="equity">Equity</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Assets: What Your Business Owns</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Assets are things your business owns that have value. They represent resources that can be used to
                    operate your business or sold to generate cash.
                  </p>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium">Examples of Assets:</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-green-100 p-1 text-green-600 dark:bg-green-900 dark:text-green-400">
                          •
                        </span>
                        <span>
                          <strong>Cash & Bank Accounts</strong>: Money in your checking, savings, or business accounts
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-green-100 p-1 text-green-600 dark:bg-green-900 dark:text-green-400">
                          •
                        </span>
                        <span>
                          <strong>Property</strong>: Buildings, land, or office space that your business owns
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-green-100 p-1 text-green-600 dark:bg-green-900 dark:text-green-400">
                          •
                        </span>
                        <span>
                          <strong>Equipment</strong>: Machinery, computers, furniture, or vehicles
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-green-100 p-1 text-green-600 dark:bg-green-900 dark:text-green-400">
                          •
                        </span>
                        <span>
                          <strong>Inventory</strong>: Products you plan to sell
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 rounded border-l-4 border-l-green-600 bg-green-50 p-3 dark:bg-green-900/30">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      When tracking assets, think: "What does my business OWN that has VALUE?"
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liabilities" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                  <Building className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Liabilities: What Your Business Owes</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Liabilities are debts and financial obligations your business has to others. They represent money
                    that your business needs to pay back.
                  </p>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium">Examples of Liabilities:</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-red-100 p-1 text-red-600 dark:bg-red-900 dark:text-red-400">
                          •
                        </span>
                        <span>
                          <strong>Loans</strong>: Money borrowed from banks or other lenders
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-red-100 p-1 text-red-600 dark:bg-red-900 dark:text-red-400">
                          •
                        </span>
                        <span>
                          <strong>Credit Cards</strong>: Outstanding balances on business credit cards
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-red-100 p-1 text-red-600 dark:bg-red-900 dark:text-red-400">
                          •
                        </span>
                        <span>
                          <strong>Accounts Payable</strong>: Money owed to suppliers or vendors
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-red-100 p-1 text-red-600 dark:bg-red-900 dark:text-red-400">
                          •
                        </span>
                        <span>
                          <strong>Mortgages</strong>: Loans for business property
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 rounded border-l-4 border-l-red-600 bg-red-50 p-3 dark:bg-red-900/30">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                      When tracking liabilities, think: "What does my business OWE to others?"
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equity" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Equity: Your Business's Net Worth</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Equity represents the owner's stake in the business. It's what would be left over if you sold all
                    assets and paid off all liabilities.
                  </p>

                  <div className="mt-4 rounded bg-slate-100 p-4 dark:bg-slate-800">
                    <div className="flex items-center justify-between font-medium">
                      <span>Assets</span>
                      <span>$100,000</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-red-600">
                      <span>- Liabilities</span>
                      <span>$40,000</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between font-bold">
                      <span>= Equity</span>
                      <span>$60,000</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium">Components of Equity:</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-blue-100 p-1 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                          •
                        </span>
                        <span>
                          <strong>Owner Investments</strong>: Money you've put into the business
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-blue-100 p-1 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                          •
                        </span>
                        <span>
                          <strong>Retained Earnings</strong>: Profits kept in the business
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 rounded border-l-4 border-l-blue-600 bg-blue-50 p-3 dark:bg-blue-900/30">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                      Equity = Assets - Liabilities (What the business is worth to you)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-4 flex items-center justify-between">
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

