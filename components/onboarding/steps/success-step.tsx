"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { CheckCircle, ChevronRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"
import type { FormData } from "../onboarding-form"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"

interface SuccessStepProps {
  onComplete: () => void
  onBack: () => void
  formData?: FormData
}

export function SuccessStep({ onComplete, onBack, formData }: SuccessStepProps) {
  const [progress, setProgress] = useState(0)
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()
  const { data: session } = useSession()
  const { selectedCurrency } = useCurrencyStore()

  const handleComplete = useCallback(async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to complete onboarding",
        variant: "destructive",
      })
      return
    }

    try {
      // Use the parent's onComplete handler which saves data first
      await onComplete()
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      })
    }
  }, [session?.user?.id, onComplete])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1)
      } else {
        handleComplete()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, handleComplete])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(progress + 4)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [progress])

  // Calculate some summary statistics
  const totalAssets = formData?.assets?.reduce((sum, asset) => sum + (asset.value || 0), 0) || 0
  const totalLiabilities = formData?.liabilities?.reduce((sum, liability) => sum + (liability.amount || 0), 0) || 0
  const totalEquity = formData?.equity?.reduce((sum, equity) => sum + (equity.amount || 0), 0) || 0

  // Note: These fields might not exist in your FormData type, so commenting them out
  // const totalMonthlyRevenue = formData?.revenueSources?.reduce((sum, source) => sum + (source.estimatedMonthly || 0), 0) || 0
  // const totalMonthlyExpenses = formData?.expenseCategories?.reduce((sum, category) => sum + (category.estimatedMonthly || 0), 0) || 0
  // const monthlyProfit = totalMonthlyRevenue - totalMonthlyExpenses

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
        >
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </motion.div>

        <h1 className="text-3xl font-bold tracking-tight">Setup Complete!</h1>
        <p className="mt-2 text-muted-foreground">Your business financial profile has been set up successfully</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>Here's a snapshot of your business finances</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/30">
              <div className="text-sm font-medium text-green-700 dark:text-green-300">Total Assets</div>
              <div className="mt-1 text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(totalAssets, selectedCurrency.code)}
              </div>
            </div>
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/30">
              <div className="text-sm font-medium text-red-700 dark:text-red-300">Total Liabilities</div>
              <div className="mt-1 text-2xl font-bold text-red-700 dark:text-red-300">
                {formatCurrency(totalLiabilities, selectedCurrency.code)}
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Equity</div>
              <div className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(totalEquity, selectedCurrency.code)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">You'll be redirected to your dashboard in {countdown} seconds</p>
          <Progress value={progress} className="mt-2" />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <div className="space-x-2">
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button onClick={handleComplete} className="gap-1">
              Go to Dashboard
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

