"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { getTransactions } from "@/lib/actions/transactions"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import type { DateRange } from "react-day-picker"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  account: string
}

interface TransactionTableProps {
  dateRange?: DateRange
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue<string>("date"))
      return date.toLocaleDateString()
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue<"income" | "expense">("type")
      return (
        <div className={`capitalize ${type === "income" ? "text-green-500" : "text-red-500"}`}>
          {type}
        </div>
      )
    },
  },
  {
    accessorKey: "account",
    header: "Account",
    cell: ({ row }) => <div className="capitalize">{row.getValue("account")}</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"))
      const type = row.original.type.toLowerCase()
      const { selectedCurrency } = useCurrencyStore()
      const formatted = formatCurrency(Math.abs(amount), selectedCurrency.code)

      return (
        <div className={type === "income" ? "text-green-500" : "text-red-500"}>
          {type === "income" ? "+" : "-"}
          {formatted}
        </div>
      )
    },
  },
]

export function TransactionTable({ dateRange }: TransactionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const { selectedCurrency } = useCurrencyStore()

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["transactions", dateRange?.from, dateRange?.to],
    queryFn: async () => {
      const result = await getTransactions()
      if (result.error) {
        throw new Error(result.error)
      }
      return result.transactions || []
    },
  })

  // Get unique categories for filter
  const categories = Array.from(new Set(transactionsData?.map(t => t.category) || []))

  const table = useReactTable({
    data: transactionsData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter: typeFilter !== "all" ? typeFilter : undefined,
    },
  })

  // Filter by type
  const filteredData = typeFilter === "all"
    ? table.getRowModel().rows
    : table.getRowModel().rows.filter(row => row.original.type === typeFilter)

  // Filter by category
  const finalData = categoryFilter === "all"
    ? filteredData
    : filteredData.filter(row => row.original.category === categoryFilter)

  const handleExport = () => {
    const csvContent = [
      ["Date", "Description", "Category", "Type", "Account", "Amount"],
      ...finalData.map(row => [
        new Date(row.original.date).toLocaleDateString(),
        row.original.description,
        row.original.category,
        row.original.type,
        row.original.account,
        formatCurrency(row.original.amount, selectedCurrency.code),
      ]),
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading transactions...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <Input
            placeholder="Search transactions..."
            value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ChevronDown className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {finalData.length ? (
              finalData.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}

