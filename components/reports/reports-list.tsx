import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { FileText, Loader2, MoreVertical, Download, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getReports, deleteReport } from "@/lib/actions/reports"
import type { Report } from "@prisma/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

interface ReportsListProps {
  onViewStatement: (report: Report) => void
  onEditReport: (report: Report) => void
}

export function ReportsList({ onViewStatement, onEditReport }: ReportsListProps) {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getReports()
      if (result.error) {
        throw new Error(result.error)
      }
      setReports(result.reports)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleDelete = async (report: Report) => {
    try {
      const result = await deleteReport(report.id)
      if (result.error) {
        throw new Error(result.error)
      }
      toast.success("Report deleted successfully")
      fetchReports()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete report")
    }
  }

  const handleDownload = (report: Report) => {
    try {
      const doc = new jsPDF()
      const data = report.data as any

      // Add title
      doc.setFontSize(16)
      doc.text(report.name, 14, 15)
      doc.setFontSize(12)

      // Add period
      doc.text(`Period: ${data.periodStart} to ${data.periodEnd}`, 14, 25)

      // Add summary
      doc.setFontSize(14)
      doc.text("Summary", 14, 35)
      doc.setFontSize(12)
      const summaryData = [
        ["Total Revenue", `$${data.summary.totalRevenue.toFixed(2)}`],
        ["Total Expenses", `$${data.summary.totalExpenses.toFixed(2)}`],
        ["Net Profit/Loss", `$${data.summary.netProfitLoss.toFixed(2)}`],
        ["Profit Margin", `${data.summary.profitMargin}%`],
        ["Month over Month Growth", `${data.summary.monthOverMonthGrowth}%`],
      ]
      doc.autoTable({
        startY: 40,
        head: [["Metric", "Value"]],
        body: summaryData,
        theme: "grid",
      })

      // Add revenue breakdown
      doc.setFontSize(14)
      doc.text("Revenue Breakdown", 14, doc.lastAutoTable.finalY + 15)
      doc.setFontSize(12)
      const revenueData = data.revenue.map((rev: any) => [
        rev.category,
        `$${rev.amount.toFixed(2)}`,
      ])
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Category", "Amount"]],
        body: revenueData,
        theme: "grid",
      })

      // Add expenses breakdown
      doc.setFontSize(14)
      doc.text("Expenses Breakdown", 14, doc.lastAutoTable.finalY + 15)
      doc.setFontSize(12)
      const expensesData = data.expenses.map((exp: any) => [
        exp.category,
        `$${exp.amount.toFixed(2)}`,
      ])
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Category", "Amount"]],
        body: expensesData,
        theme: "grid",
      })

      // Add analysis
      doc.setFontSize(14)
      doc.text("Analysis", 14, doc.lastAutoTable.finalY + 15)
      doc.setFontSize(12)
      const analysisData = [
        ["Insights", data.analysis.insights.join("\n")],
        ["Recommendations", data.analysis.recommendations.join("\n")],
        ["Risk Factors", data.analysis.riskFactors.join("\n")],
        ["Opportunities", data.analysis.opportunities.join("\n")],
      ]
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Category", "Details"]],
        body: analysisData,
        theme: "grid",
      })

      // Save the PDF
      doc.save(`${report.name.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(report.date), "yyyy-MM")}.pdf`)
      toast.success("Report downloaded successfully")
    } catch (err) {
      toast.error("Failed to generate PDF")
    }
  }

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchReports}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Reports</CardTitle>
          <CardDescription>Generate a P&L statement to get started.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="h-[400px] overflow-y-auto pr-2">
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">{report.name}</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewStatement(report)}
                >
                  View
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditReport(report)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(report)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(report)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Generated on {format(new Date(report.date), "PPP")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 