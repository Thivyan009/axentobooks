"use client"

import { notFound } from "next/navigation"
import { ArrowLeft, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatementView } from "@/components/profit-loss/statement-view"
import { BalanceSheetView } from "@/components/reports/balance-sheet-view"
import { mockReports } from "@/lib/data/mock-reports"
import Link from "next/link"

interface StatementPageProps {
  params: {
    id: string
  }
  searchParams: {
    type?: string
  }
}

export default function StatementPage({ params, searchParams }: StatementPageProps) {
  const report = mockReports.find((r) => r.id === params.id)

  if (!report) {
    notFound()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Implement download functionality
    console.log("Download clicked")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between print:hidden">
          <Link href="/reports">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Button>
          </Link>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg border shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{report.name}</h1>
            <p className="text-muted-foreground">
              {new Date(report.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="space-y-6">
            {report.type === "pl" ? (
              <StatementView statement={report.data} />
            ) : (
              <BalanceSheetView statement={report.data} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

