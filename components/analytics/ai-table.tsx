"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import type { Transaction } from "@/lib/types"
import { formatCurrency } from "@/lib/utils/format-currency"

interface AITableProps {
  transactions: Transaction[]
  isLoading?: boolean
  onUpdateStatus: (id: string, status: Transaction["status"]) => void
}

export function AITable({ transactions, isLoading, onUpdateStatus }: AITableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleAll = () => {
    if (selectedIds.size === transactions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(transactions.map((t) => t.id)))
    }
  }

  const toggleOne = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Axento Intelligence (AI)</CardTitle>
          <p className="text-sm text-muted-foreground">Manage your payments.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 w-full animate-pulse bg-muted rounded" />
            <div className="h-8 w-full animate-pulse bg-muted rounded" />
            <div className="h-8 w-full animate-pulse bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Axento Intelligence (AI)</CardTitle>
        <p className="text-sm text-muted-foreground">Manage your payments.</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selectedIds.size === transactions.length} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(transaction.id)}
                    onCheckedChange={() => toggleOne(transaction.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        transaction.status === "Success"
                          ? "bg-green-500"
                          : transaction.status === "Processing"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    {transaction.status}
                  </div>
                </TableCell>
                <TableCell>{transaction.email}</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onUpdateStatus(transaction.id, "Success")}>
                        Mark as Success
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(transaction.id, "Processing")}>
                        Mark as Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(transaction.id, "Failed")}>
                        Mark as Failed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

