"use client"

import { useEffect, useState } from "react"
import { SuperAdminNav } from "../components/super-admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Activity,
  Server,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { prisma } from "@/lib/prisma"
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"
import { Loader2 } from "lucide-react"

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalBusinesses: number
  financials: {
    totalIncome: number
    totalExpenses: number
    netRevenue: number
    incomeCount: number
    expenseCount: number
    incomeGrowth: number
    expenseGrowth: number
  }
  userGrowth: number
  businessGrowth: number
}

export default function SuperAdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/super-admin/stats")
        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SuperAdminNav />
      <div className="p-8">
        <h1 className="mb-8 text-3xl font-bold">Super Admin Dashboard</h1>
        
        {/* User and Business Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <div className={`flex items-center ${stats?.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.userGrowth >= 0 ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                <span className="ml-1">{Math.abs(stats?.userGrowth || 0)}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Active: {stats?.activeUsers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
              <div className={`flex items-center ${stats?.businessGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.businessGrowth >= 0 ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                <span className="ml-1">{Math.abs(stats?.businessGrowth || 0)}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBusinesses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.financials.netRevenue || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Income: {formatCurrency(stats?.financials.totalIncome || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <div className={`flex items-center ${stats?.financials.expenseGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.financials.expenseGrowth <= 0 ? <ArrowDownIcon className="h-4 w-4" /> : <ArrowUpIcon className="h-4 w-4" />}
                <span className="ml-1">{Math.abs(stats?.financials.expenseGrowth || 0)}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.financials.totalExpenses || 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Stats */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Transaction Overview</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Income Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.financials.incomeCount || 0}</div>
                <div className={`flex items-center ${stats?.financials.incomeGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats?.financials.incomeGrowth >= 0 ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                  <span className="ml-1">{Math.abs(stats?.financials.incomeGrowth || 0)}% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Expense Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.financials.expenseCount || 0}</div>
                <div className={`flex items-center ${stats?.financials.expenseGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats?.financials.expenseGrowth <= 0 ? <ArrowDownIcon className="h-4 w-4" /> : <ArrowUpIcon className="h-4 w-4" />}
                  <span className="ml-1">{Math.abs(stats?.financials.expenseGrowth || 0)}% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Average Transaction Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    (stats?.financials.totalIncome || 0) / (stats?.financials.incomeCount || 1)
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Per income transaction</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 