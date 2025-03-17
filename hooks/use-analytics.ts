"use client"

import { useState, useEffect } from "react"
import type { AnalyticsData, Transaction } from "@/lib/types"

// Simulated API data - In a real app, this would come from your backend
const MOCK_DATA: AnalyticsData = {
  revenue: 15231.89,
  expense: 12234.59,
  profit: 2997.3,
  percentageChange: {
    revenue: 20.1,
    expense: 15.5,
    profit: 25.3,
  },
  chartData: {
    january: {
      revenue: [40, 60, 45, 42, 40, 45, 55, 70],
      expense: [65, 70, 50, 65, 45, 50, 65, 45],
      profit: [45, 55, 45, 50, 40, 45, 55, 45],
    },
    february: {
      revenue: [45, 55, 50, 48, 45, 50, 58, 75],
      expense: [60, 65, 55, 60, 50, 55, 60, 50],
      profit: [50, 60, 48, 55, 45, 50, 58, 50],
    },
    // Add more months as needed
  },
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    status: "Success",
    email: "ken99@yahoo.com",
    amount: 316.0,
    date: "2024-02-22",
  },
  {
    id: "2",
    status: "Success",
    email: "abe45@gmail.com",
    amount: 242.0,
    date: "2024-02-22",
  },
  {
    id: "3",
    status: "Processing",
    email: "monserrat44@gmail.com",
    amount: 837.0,
    date: "2024-02-21",
  },
  {
    id: "4",
    status: "Failed",
    email: "carmella@hotmail.com",
    amount: 721.0,
    date: "2024-02-20",
  },
]

export function useAnalytics() {
  const [selectedMonth, setSelectedMonth] = useState<string>("january")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(MOCK_DATA)
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Simulate API call when month changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // In a real app, you would fetch data from your API here
        // const response = await fetch(`/api/analytics/${selectedMonth}`)
        // const data = await response.json()

        // Using mock data for demonstration
        setAnalyticsData(MOCK_DATA)
        setTransactions(MOCK_TRANSACTIONS)
      } catch (err) {
        setError("Failed to fetch analytics data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const updateTransactionStatus = async (id: string, status: Transaction["status"]) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      setTransactions((current) =>
        current.map((transaction) => (transaction.id === id ? { ...transaction, status } : transaction)),
      )
    } catch (err) {
      setError("Failed to update transaction status")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    selectedMonth,
    setSelectedMonth,
    analyticsData,
    transactions,
    isLoading,
    error,
    updateTransactionStatus,
  }
}

