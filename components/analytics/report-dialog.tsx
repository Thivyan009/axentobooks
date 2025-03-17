"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StatementView } from "@/components/profit-loss/statement-view"
import { mockPLStatement } from "@/lib/data/mock-pl-statements"

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportDialog({ open, onOpenChange }: ReportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Financial Report</DialogTitle>
          <DialogDescription>Detailed profit and loss statement with AI-powered insights.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto">
          <StatementView statement={mockPLStatement} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

