"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Download, Eye, FileBarChart, FileLineChart, FileText, Grid2X2, List, Plus, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportDialog } from "@/components/reports/report-dialog"
import { mockReports } from "@/lib/data/mock-reports"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import type { SavedReport } from "@/lib/types/reports"

export function ReportsContent() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredReports = mockReports.filter(
    (report) =>
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      format(new Date(report.date), "MMMM yyyy").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDownload = (report: SavedReport) => {
    const jsonString = JSON.stringify(report.data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.name.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(report.date), "yyyy-MM")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report Downloaded",
      description: "The report has been downloaded successfully.",
    })
  }

  const handleViewStatement = (report: SavedReport) => {
    window.location.href = `/reports/statement/${report.id}`
  }

  const handleView = (report: SavedReport) => {
    setSelectedReport(report)
    setDialogOpen(true)
  }

  const handleEdit = (report: SavedReport) => {
    // Placeholder for edit functionality
    console.log(`Editing report ${report.id}`)
  }

  const handleDelete = (report: SavedReport) => {
    // Placeholder for delete functionality
    console.log(`Deleting report ${report.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <Tabs value={view} onValueChange={(value) => setView(value as "grid" | "list")}>
            <TabsList>
              <TabsTrigger value="grid">
                <Grid2X2 className="mr-2 h-4 w-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="mr-2 h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <Card key={report.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {report.type === "pl" ? (
                      <FileLineChart className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <FileBarChart className="h-5 w-5 text-muted-foreground" />
                    )}
                    <CardTitle className="text-base">{report.name}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(report)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>{format(new Date(report.date), "MMMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedReport(report)
                    setDialogOpen(true)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Quick View
                </Button>
                <Button variant="default" className="w-full" onClick={() => handleViewStatement(report)}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Statement
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    {report.type === "pl" ? (
                      <FileLineChart className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <FileBarChart className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <h3 className="font-medium">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">{format(new Date(report.date), "MMMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedReport(report)
                        setDialogOpen(true)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Quick View
                    </Button>
                    <Button variant="default" onClick={() => handleViewStatement(report)}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Statement
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(report)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <ReportDialog report={selectedReport} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

