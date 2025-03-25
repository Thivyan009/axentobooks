"use client"

import { useState } from "react"
import {
  BarChart3,
  BrainCircuit,
  Building2,
  Home,
  LineChart,
  Menu,
  PieChart,
  Plus,
  Receipt,
  Settings,
  Upload,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { notify } from "@/lib/notifications"
import Link from "next/link"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for larger screens */}
      <aside className="hidden w-64 border-r bg-muted/40 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <span className="flex items-center gap-2 font-semibold">
              <BrainCircuit className="h-6 w-6" />
              Axento Books
            </span>
          </div>
          <nav className="flex-1 space-y-1 p-2">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Receipt className="h-4 w-4" />
              Transactions
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LineChart className="h-4 w-4" />
              Reports
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <FileText className="h-4 w-4" />
              Invoices
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Building2 className="h-4 w-4" />
              Company
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <span className="flex items-center gap-2 font-semibold">
                <BrainCircuit className="h-6 w-6" />
                Axento Books
              </span>
            </div>
            <nav className="flex-1 space-y-1 p-2">
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setSidebarOpen(false)}>
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setSidebarOpen(false)}>
                <Receipt className="h-4 w-4" />
                Transactions
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setSidebarOpen(false)}>
                <LineChart className="h-4 w-4" />
                Reports
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setSidebarOpen(false)}>
                <FileText className="h-4 w-4" />
                Invoices
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setSidebarOpen(false)}>
                <Building2 className="h-4 w-4" />
                Company
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setSidebarOpen(false)}>
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">Dashboard</h1>
          </div>
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link href="/invoices">
              <FileText className="h-4 w-4" />
              Invoices
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription>
                  Manually add a transaction or upload a bank statement for AI-powered categorization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" placeholder="Enter amount" type="number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Transaction description" />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file">Upload Bank Statement</Label>
                  <div className="flex items-center gap-2">
                    <Input id="file" type="file" />
                    <Button size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>
        <main className="flex-1 space-y-4 p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,234.59</div>
                <p className="text-xs text-muted-foreground">+4.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$32,997.30</div>
                <p className="text-xs text-muted-foreground">+12.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
                <BrainCircuit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">New recommendations</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>AI-categorized transactions from your accounts.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2024-02-22</TableCell>
                      <TableCell>Office Supplies</TableCell>
                      <TableCell>Expenses</TableCell>
                      <TableCell className="text-right">-$234.50</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-02-21</TableCell>
                      <TableCell>Client Payment</TableCell>
                      <TableCell>Income</TableCell>
                      <TableCell className="text-right">$1,500.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-02-20</TableCell>
                      <TableCell>Software Subscription</TableCell>
                      <TableCell>Expenses</TableCell>
                      <TableCell className="text-right">-$49.99</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>AI Financial Insights</CardTitle>
                <CardDescription>Smart suggestions based on your financial data.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-muted/40 p-4">
                      <h4 className="mb-2 font-medium">Cash Flow Optimization</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on your payment patterns, scheduling vendor payments on the 15th could improve cash flow
                        by 12%.
                      </p>
                    </div>
                    <div className="rounded-lg border bg-muted/40 p-4">
                      <h4 className="mb-2 font-medium">Expense Alert</h4>
                      <p className="text-sm text-muted-foreground">
                        Software subscription costs have increased by 25% in the last quarter. Consider reviewing and
                        consolidating services.
                      </p>
                    </div>
                    <div className="rounded-lg border bg-muted/40 p-4">
                      <h4 className="mb-2 font-medium">Revenue Opportunity</h4>
                      <p className="text-sm text-muted-foreground">
                        Historical data suggests Q1 is your strongest quarter. Consider increasing marketing budget by
                        20% to maximize growth.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

