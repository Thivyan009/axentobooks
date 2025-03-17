"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"

const mockAssets = [
  {
    name: "Office Equipment",
    category: "Fixed Assets",
    value: 25000,
    purchaseDate: "2023-01-15",
  },
  {
    name: "Cash in Bank",
    category: "Current Assets",
    value: 75000,
    purchaseDate: "2023-01-01",
  },
  {
    name: "Inventory",
    category: "Current Assets",
    value: 50000,
    purchaseDate: "2023-02-01",
  },
]

export function Assets() {
  const { selectedCurrency } = useCurrencyStore()
  const totalAssets = mockAssets.reduce((sum, asset) => sum + asset.value, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Assets</CardTitle>
            <CardDescription>Your business assets and their current value</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Total Value</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAssets, selectedCurrency.code)}
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
              <TableHead>Purchase Date</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAssets.map((asset) => (
              <TableRow key={asset.name}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.category}</TableCell>
                <TableCell>{new Date(asset.purchaseDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(asset.value, selectedCurrency.code)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 