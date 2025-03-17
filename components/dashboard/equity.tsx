"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"

const mockEquity = [
  {
    name: "Owner's Investment",
    category: "Owner's Equity",
    value: 50000,
    date: "2023-01-01",
  },
  {
    name: "Retained Earnings",
    category: "Retained Earnings",
    value: 25000,
    date: "2023-12-31",
  },
  {
    name: "Additional Capital",
    category: "Owner's Equity",
    value: 10000,
    date: "2023-06-15",
  },
]

export function Equity() {
  const { selectedCurrency } = useCurrencyStore()
  const totalEquity = mockEquity.reduce((sum, equity) => sum + equity.value, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Equity</CardTitle>
            <CardDescription>Your business's net worth and ownership</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Total Value</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalEquity, selectedCurrency.code)}
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
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEquity.map((equity) => (
              <TableRow key={equity.name}>
                <TableCell>{equity.name}</TableCell>
                <TableCell>{equity.category}</TableCell>
                <TableCell>{new Date(equity.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(equity.value, selectedCurrency.code)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 