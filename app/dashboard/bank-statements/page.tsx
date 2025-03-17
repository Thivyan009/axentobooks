"use client"

import { useState } from "react"
import { BankStatementUpload } from "@/components/dashboard/bank-statement-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadStatement } from "@/components/upload-statement"

interface BankStatement {
  id: string
  statementNumber: string
  date: string
  balance: number
  currency: string
  accountId: string
  createdAt: string
}

export default function BankStatementsPage() {
  const [activeTab, setActiveTab] = useState("upload")

  const { data: statements, isLoading } = useQuery<BankStatement[]>({
    queryKey: ["bankStatements"],
    queryFn: async () => {
      const response = await fetch("/api/bank-statements")
      if (!response.ok) throw new Error("Failed to fetch bank statements")
      return response.json()
    },
  })

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bank Statements</h1>
          <p className="text-muted-foreground">
            Upload and manage your bank statements with AI-powered analysis
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upload">Upload Statement</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <UploadStatement />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Previous Uploads</CardTitle>
              <CardDescription>
                View and manage your previously uploaded bank statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Statement Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statements?.map((statement) => (
                      <TableRow key={statement.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>{statement.statementNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(statement.date), "MMMM yyyy")}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: statement.currency
                          }).format(statement.balance)}
                        </TableCell>
                        <TableCell>{statement.accountId}</TableCell>
                        <TableCell>
                          {format(new Date(statement.createdAt), "PPp")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/api/bank-statements/${statement.id}`, "_blank")}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 