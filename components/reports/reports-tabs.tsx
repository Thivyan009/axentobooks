"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportList } from "./report-list"
import { ReportGrid } from "./report-grid"
import { Grid2X2, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SavedReport } from "@/lib/types/reports"

interface ReportsTabsProps {
  reports: SavedReport[]
  onView: (report: SavedReport) => void
  onViewStatement: (report: SavedReport) => void
  onEdit: (report: SavedReport) => void
  onDelete: (report: SavedReport) => void
  onDownload: (report: SavedReport) => void
}

export function ReportsTabs({ reports, onView, onViewStatement, onEdit, onDelete, onDownload }: ReportsTabsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReports = reports.filter((report) =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <ReportGrid
          reports={filteredReports}
          onView={onView}
          onViewStatement={onViewStatement}
          onEdit={onEdit}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ) : (
        <ReportList
          reports={filteredReports}
          onView={onView}
          onViewStatement={onViewStatement}
          onEdit={onEdit}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      )}
    </div>
  )
}

