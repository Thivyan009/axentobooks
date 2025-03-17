"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDate } from "@/lib/utils"

interface Transaction {
  Date: string
  Description: string
  Amount: string
  selected?: boolean
}

interface TransactionPreviewProps {
  isOpen: boolean
  onClose: () => void
  transactions: Transaction[]
  onConfirm: (selectedTransactions: Transaction[]) => void
  isProcessing: boolean
}

export function TransactionPreview({
  isOpen,
  onClose,
  transactions,
  onConfirm,
  isProcessing,
}: TransactionPreviewProps) {
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>(
    transactions.map(t => ({ ...t, selected: true }))
  )

  const handleSelectAll = (checked: boolean) => {
    setSelectedTransactions(
      selectedTransactions.map(t => ({ ...t, selected: checked }))
    )
  }

  const handleSelectTransaction = (index: number, checked: boolean) => {
    setSelectedTransactions(
      selectedTransactions.map((t, i) =>
        i === index ? { ...t, selected: checked } : t
      )
    )
  }

  const handleConfirm = () => {
    onConfirm(selectedTransactions.filter(t => t.selected))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Review Transactions</DialogTitle>
          <DialogDescription>
            Review and select the transactions you want to import. Uncheck any transactions you don't want to import.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedTransactions.every(t => t.selected)}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[120px] text-right">Amount</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTransactions.map((transaction, index) => {
                const amount = parseFloat(transaction.Amount.replace(/[$,]/g, ''))
                const type = amount < 0 ? "expense" : "income"
                
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={transaction.selected}
                        onCheckedChange={(checked) => 
                          handleSelectTransaction(index, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(transaction.Date))}
                    </TableCell>
                    <TableCell>{transaction.Description}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${Math.abs(amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={type === "expense" ? "text-red-500" : "text-green-500"}>
                        {type}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <div className="flex justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {selectedTransactions.filter(t => t.selected).length} of {transactions.length} transactions selected
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isProcessing || !selectedTransactions.some(t => t.selected)}
              >
                {isProcessing ? "Importing..." : "Import Selected"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 