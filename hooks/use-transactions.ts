"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { notify } from "@/lib/notifications"
import {
  createTransaction,
  deleteTransaction,
  deleteTransactions,
  updateTransactionStatus,
  getTransactions,
} from "@/lib/actions/transactions"
import type { Transaction } from "@/lib/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export function useTransactions(initialTransactions: Transaction[]) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  
  // Initialize with current month in YYYY-MM format
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  // Use React Query for real-time transaction data
  const { data: transactionsData, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const result = await getTransactions()
      if (result.error) throw new Error(result.error)
      return result.transactions
    },
    initialData: initialTransactions,
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 0, // Consider data stale immediately
  })

  const allTransactions = transactionsData || initialTransactions

  // Filter transactions by selected month
  const transactions = allTransactions.filter((transaction) => {
    if (!transaction.date) return false
    const transactionDate = new Date(transaction.date)
    // Ensure the date is valid
    if (isNaN(transactionDate.getTime())) return false
    
    const [year, month] = selectedMonth.split('-')
    return (
      transactionDate.getFullYear() === parseInt(year) &&
      transactionDate.getMonth() + 1 === parseInt(month)
    )
  })

  // Log state changes for debugging
  useEffect(() => {
    console.log("Transactions Debug:", {
      selectedMonth,
      allTransactionsCount: allTransactions.length,
      filteredTransactionsCount: transactions.length,
      sampleDates: allTransactions.slice(0, 3).map(t => ({
        id: t.id,
        originalDate: t.date,
        parsedDate: new Date(t.date),
        year: new Date(t.date).getFullYear(),
        month: new Date(t.date).getMonth() + 1
      }))
    })
  }, [allTransactions, transactions, selectedMonth])

  const updateTransactionsState = useCallback((transactions: Transaction[]) => {
    queryClient.setQueryData(["transactions"], transactions)
  }, [queryClient])

  const addTransaction = useCallback(async (data: Omit<Transaction, "id" | "status">) => {
    try {
      startTransition(async () => {
        const result = await createTransaction(data)
        if (result.error) {
          notify.error(result.error)
          return
        }
        notify.success("Transaction added successfully")
        // Invalidate and refetch transactions
        queryClient.invalidateQueries({ queryKey: ["transactions"] })
      })
    } catch (error) {
      console.error("Failed to add transaction:", error)
      notify.error("Failed to add transaction")
    }
  }, [queryClient])

  const updateStatus = useCallback(async (id: string, status: Transaction["status"]) => {
    try {
      startTransition(async () => {
        const result = await updateTransactionStatus(id, status)
        if (result.error) {
          notify.error(result.error)
          return
        }
        notify.success("Transaction status updated")
        // Invalidate and refetch transactions
        queryClient.invalidateQueries({ queryKey: ["transactions"] })
      })
    } catch (error) {
      console.error("Failed to update status:", error)
      notify.error("Failed to update status")
    }
  }, [queryClient])

  const deleteSelected = useCallback(async () => {
    try {
      const ids = Array.from(selectedIds)
      startTransition(async () => {
        const result = await deleteTransactions(ids)
        if (result.error) {
          notify.error(result.error)
          return
        }
        notify.success("Selected transactions deleted")
        setSelectedIds(new Set())
        // Invalidate and refetch transactions
        queryClient.invalidateQueries({ queryKey: ["transactions"] })
      })
    } catch (error) {
      console.error("Failed to delete transactions:", error)
      notify.error("Failed to delete transactions")
    }
  }, [selectedIds, queryClient])

  const deleteSingle = useCallback(async (id: string) => {
    try {
      startTransition(async () => {
        const result = await deleteTransaction(id)
        if (result.error) {
          notify.error(result.error)
          return
        }
        notify.success("Transaction deleted successfully")
        // Invalidate and refetch transactions
        queryClient.invalidateQueries({ queryKey: ["transactions"] })
      })
    } catch (error) {
      console.error("Failed to delete transaction:", error)
      notify.error("Failed to delete transaction")
    }
  }, [queryClient])

  return {
    transactions,
    allTransactions,
    selectedIds,
    setSelectedIds,
    selectedMonth,
    setSelectedMonth,
    isPending,
    isLoading,
    error,
    addTransaction,
    updateStatus,
    deleteSelected,
    deleteSingle,
    updateTransactionsState,
  }
}

