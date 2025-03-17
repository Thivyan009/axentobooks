"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"

const mockLiabilities = [
  {
    name: "Bank Loan",
    category: "Long-term Liabilities",
    value: 40000,
    dueDate: "2025-12-31",
  },
  {
    name: "Accounts Payable",
    category: "Current Liabilities",
    value: 15000,
    dueDate: "2024-02-28",
  },
  {
    name: "Credit Card",
    category: "Current Liabilities",
    value: 10000,
    dueDate: "2024-01-31",
  },
]

export function Liabilities() {
  const { selectedCurrency } = useCurrencyStore()
  const totalLiabilities = mockLiabilities.reduce((sum, liability) => sum + liability.value, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Liabilities</CardTitle>
            <CardDescription>Your business debts and obligations</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Total Value</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalLiabilities, selectedCurrency.code)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLiabilities.map((liability) => (
              <TableRow key={liability.name}>
                <TableCell>{liability.name}</TableCell>
                <TableCell>{liability.category}</TableCell>
                <TableCell>{new Date(liability.dueDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(liability.value, selectedCurrency.code)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 