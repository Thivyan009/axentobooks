"use client"
import { format } from "date-fns"
import { Download, Eye, FileText, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { SavedReport } from "@/lib/types/reports"

interface ReportGridProps {
  reports: SavedReport[]
  onView: (report: SavedReport) => void
  onViewStatement: (report: SavedReport) => void
  onEdit: (report: SavedReport) => void
  onDelete: (report: SavedReport) => void
  onDownload: (report: SavedReport) => void
}

export function ReportGrid({ reports, onView, onViewStatement, onEdit, onDelete, onDownload }: ReportGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {reports.length > 0 ? (
        reports.map((report) => (
          <Card key={report.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{report.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(report)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDownload(report)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(report)} className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {report.type === "pl" ? "P&L Statement" : "Balance Sheet"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{format(new Date(report.date), "MMM d, yyyy")}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(report)}>
                <Eye className="mr-2 h-3.5 w-3.5" />
                Quick View
              </Button>
              <Button variant="default" size="sm" className="flex-1" onClick={() => onViewStatement(report)}>
                <FileText className="mr-2 h-3.5 w-3.5" />
                View Statement
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center p-8">
          <p className="text-muted-foreground">No reports found.</p>
        </div>
      )}
    </div>
  )
}

