"use client"

import { useCallback } from "react"
import type { Transaction } from "@/lib/types"

export function useSearch(transactions: Transaction[], searchQuery: string) {
  const searchResults = useCallback(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    return transactions.filter(
      (transaction) =>
        transaction.name.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query) ||
        transaction.type.toLowerCase().includes(query) ||
        transaction.amount.toString().includes(query),
    )
  }, [searchQuery, transactions])

  return {
    searchResults: searchResults(),
  }
}

