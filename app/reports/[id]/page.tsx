import { notFound } from "next/navigation"
import { mockReports } from "@/lib/data/mock-reports"
import { StatementView } from "@/components/profit-loss/statement-view"
import { BalanceSheetView } from "@/components/reports/balance-sheet-view"

interface ReportPageProps {
  params: {
    id: string
  }
}

export default function ReportPage({ params }: ReportPageProps) {
  const report = mockReports.find((r) => r.id === params.id)

  if (!report) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold">{report.name}</h1>
        <p className="text-muted-foreground">Generated on {new Date(report.date).toLocaleDateString()}</p>
      </div>

      {report.type === "pl" ? <StatementView statement={report.data} /> : <BalanceSheetView statement={report.data} />}
    </div>
  )
}

