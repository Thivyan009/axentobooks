"use client"

import { useEffect, useState, useCallback } from "react"
import { Download, FileText, RefreshCw, Trash2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface BankStatement {
  id: string
  fileName: string
  originalName: string
  status: string
  date: string
  balance: number
  currency: string
  accountId: string
  statementNumber: string
  createdAt: string
}

export function BankStatementsList() {
  const [statements, setStatements] = useState<BankStatement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statementToDelete, setStatementToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchStatements = useCallback(async () => {
    try {
      const response = await fetch("/api/bank-statements")
      if (!response.ok) {
        throw new Error("Failed to fetch statements")
      }
      const data = await response.json()
      setStatements(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch statements",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchStatements()
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchStatements, 5000)
    return () => clearInterval(interval)
  }, [fetchStatements])

  const handleDelete = async () => {
    if (!statementToDelete) return

    try {
      const response = await fetch(`/api/bank-statements/${statementToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete statement")
      }

      toast({
        title: "Success",
        description: "Statement deleted successfully",
      })

      fetchStatements()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete statement",
        variant: "destructive",
      })
    } finally {
      setStatementToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Statement Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statements.map((statement) => (
              <TableRow key={statement.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {statement.originalName}
                  </div>
                </TableCell>
                <TableCell>{statement.statementNumber}</TableCell>
                <TableCell>
                  {format(new Date(statement.date), "MMMM yyyy")}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: statement.currency
                  }).format(statement.balance)}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    statement.status === "completed" 
                      ? "bg-green-100 text-green-700"
                      : statement.status === "processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {statement.status.charAt(0).toUpperCase() + statement.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(statement.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/api/bank-statements/${statement.fileName}`, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatementToDelete(statement.fileName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!statementToDelete} onOpenChange={() => setStatementToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Statement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this statement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 