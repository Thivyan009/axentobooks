"use client"

import { useState } from "react"
import { Upload, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { BankStatementsList } from "@/components/bank-statements-list"
import { SpreadsheetFormatInstructions } from "@/components/spreadsheet-format-instructions"
import { processBankStatement } from "@/lib/actions/statements"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function UploadStatement() {
  const [isUploading, setIsUploading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogContent, setDialogContent] = useState<{
    title: string
    description: string
    isError: boolean
  } | null>(null)
  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is a CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setDialogContent({
        title: "Invalid File Type",
        description: "Please upload a CSV file. Click the 'Spreadsheet Format Guide' button to see the required format.",
        isError: true
      })
      setShowDialog(true)
      return
    }

    setIsUploading(true)
    try {
      const result = await processBankStatement(file)
      
      if (result.error) {
        setDialogContent({
          title: "Upload Failed",
          description: result.error,
          isError: true
        })
      } else {
        setDialogContent({
          title: "Upload Successful",
          description: "Your transactions have been imported successfully.",
          isError: false
        })
      }
    } catch (error) {
      setDialogContent({
        title: "Upload Failed",
        description: "An unexpected error occurred while importing transactions.",
        isError: true
      })
    } finally {
      setIsUploading(false)
      setShowDialog(true)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Import Transactions</CardTitle>
          <CardDescription>
            Upload a CSV file containing your transactions. Only one statement is allowed per month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Transaction Spreadsheet</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <SpreadsheetFormatInstructions />
              </div>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file with your transactions. Click the guide button to see the required format.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <BankStatementsList />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {dialogContent?.isError ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {dialogContent?.title}
            </DialogTitle>
            <DialogDescription>
              {dialogContent?.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

