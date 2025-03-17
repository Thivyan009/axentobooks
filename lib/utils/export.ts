import { format } from "date-fns"
import type { Transaction } from "@/lib/types"

export function exportTransactionsToCSV(transactions: Transaction[]) {
  // Define CSV headers
  const headers = [
    "Date",
    "Name",
    "Type",
    "Account",
    "Category",
    "Amount",
    "Status",
    "Description"
  ]

  // Convert transactions to CSV rows
  const rows = transactions.map(transaction => [
    format(new Date(transaction.date), "yyyy-MM-dd"),
    transaction.name,
    transaction.type,
    transaction.account,
    transaction.category,
    transaction.amount.toFixed(2),
    transaction.status,
    transaction.description || ""
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  
  link.setAttribute("href", url)
  link.setAttribute("download", `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
} 