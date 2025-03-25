"use client"

import { MoreHorizontal, ArrowUpDown, Pencil, Trash } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Transaction } from "@/lib/types"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { deleteTransaction } from "@/lib/actions/transactions"
import { toast } from "@/components/ui/use-toast"

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return <div className="text-sm text-muted-foreground">{format(date, "MMM d, yyyy")}</div>
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return <div className="font-medium text-sm">{row.getValue("description")}</div>
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
          {row.getValue("category")}
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = (row.getValue("type") as string).toLowerCase()
      const isIncome = type === "income"
      return (
        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          isIncome 
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
            : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
        }`}>
          {type}
        </div>
      )
    },
  },
  {
    accessorKey: "account",
    header: "Account",
    cell: ({ row }) => {
      const account = row.getValue("account")
      return (
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {account ? account.toLowerCase() : "Not specified"}
        </div>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted/50"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number
      const type = (row.original.type as string).toLowerCase()
      const { selectedCurrency } = useCurrencyStore()
      const displayAmount = type === "income" ? Math.abs(amount) : -Math.abs(amount)
      return (
        <div className={`font-semibold ${
          type === "income" 
            ? "text-emerald-600 dark:text-emerald-400" 
            : "text-rose-600 dark:text-rose-400"
        }`}>
          {formatCurrency(displayAmount, selectedCurrency.code)}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter()
      const handleDelete = async () => {
        try {
          await deleteTransaction(row.original.id)
          toast({
            title: "Transaction deleted",
            description: "The transaction has been successfully deleted.",
          })
          router.refresh()
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete the transaction. Please try again.",
            variant: "destructive",
          })
        }
      }

      const handleEdit = () => {
        router.push(`/transactions/edit/${row.original.id}`)
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel className="text-xs font-medium">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleEdit}
              className="text-xs cursor-pointer gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-xs cursor-pointer gap-2 text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
            >
              <Trash className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

