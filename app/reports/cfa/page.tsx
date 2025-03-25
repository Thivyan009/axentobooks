"use client"

import { useEffect, useState } from "react"
import { CFAReport } from "@/components/reports/cfa-report"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getMonthlyTransactions, generatePLStatement, generateBalanceSheet } from "@/lib/actions/reports"
import type { ProfitLossStatement, BalanceSheet } from "@/lib/types/reports"

export default function CFAReportPage() {
  const [plStatement, setPLStatement] = useState<ProfitLossStatement | null>(null)
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const generateReport = async () => {
      try {
        setIsLoading(true)
        const transactions = await getMonthlyTransactions(new Date())
        const pl = await generatePLStatement(transactions)
        const bs = await generateBalanceSheet(transactions)
        setPLStatement(pl)
        setBalanceSheet(bs)
      } catch (error) {
        console.error("Error generating report:", error)
        toast({
          title: "Error",
          description: "Failed to generate financial report. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    generateReport()
  }, [toast])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // TODO: Implement PDF download functionality
    toast({
      title: "Coming Soon",
      description: "PDF download functionality will be available soon.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-medium">Generating Financial Report...</div>
          <div className="text-sm text-muted-foreground">Please wait while we process your data.</div>
        </div>
      </div>
    )
  }

  if (!plStatement || !balanceSheet) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-medium">No Data Available</div>
          <div className="text-sm text-muted-foreground">Unable to generate financial report. Please try again later.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CFA-Level Financial Report</h1>
          <p className="text-muted-foreground">
            Comprehensive financial analysis and statements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <CFAReport plStatement={plStatement} balanceSheet={balanceSheet} />
    </div>
  )
} 