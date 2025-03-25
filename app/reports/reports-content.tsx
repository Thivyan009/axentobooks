"use client"

import { useState } from "react"
import { FileText, Scale, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReportsList } from "@/components/reports/reports-list"
import { ReportDialog } from "@/components/reports/report-dialog"
import { generatePLStatement, generateBalanceSheet, getMonthlyTransactions, savePLStatement, saveBalanceSheet } from "@/lib/actions/reports"
import { toast } from "sonner"
import type { Report } from "@prisma/client"
import Link from "next/link"

export function ReportsContent() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleView = (report: Report) => {
    setSelectedReport(report)
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handleEdit = (report: Report) => {
    setSelectedReport(report)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleGeneratePL = async () => {
    try {
      setIsGenerating(true)
      const transactions = await getMonthlyTransactions(new Date())
      const statement = await generatePLStatement(transactions)
      await savePLStatement(statement, new Date())
      toast.success("P&L statement generated successfully")
      // Refresh the reports list
      window.location.reload()
    } catch (error) {
      console.error("Error generating P&L statement:", error)
      toast.error("Failed to generate P&L statement. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateBalanceSheet = async () => {
    try {
      setIsGenerating(true)
      const transactions = await getMonthlyTransactions(new Date())
      const statement = await generateBalanceSheet(transactions)
      await saveBalanceSheet(statement, new Date())
      toast.success("Balance sheet generated successfully")
      // Refresh the reports list
      window.location.reload()
    } catch (error) {
      console.error("Error generating balance sheet:", error)
      toast.error("Failed to generate balance sheet. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <Button onClick={handleGeneratePL} disabled={isGenerating}>
            <FileText className="mr-2 h-4 w-4" />
            Generate PL
          </Button>
          <Button disabled>
            <Scale className="mr-2 h-4 w-4" />
            Balance Sheet (Coming Soon)
          </Button>
          <Button asChild>
            <Link href="/reports/cfa">
              <GraduationCap className="mr-2 h-4 w-4" />
              CFA Report
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>View your past P&L statements and reports</CardDescription>
        </CardHeader>
        <CardContent>
          <ReportsList 
            onViewStatement={handleView} 
            onEditReport={handleEdit}
          />
        </CardContent>
      </Card>

      <ReportDialog
        report={selectedReport}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditing={isEditing}
      />
    </main>
  )
}

