"use client"

import { useState } from "react"
import { BarChart, Download, FileText, Filter, PieChart, Plus, Save, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import type { DateRange } from "react-day-picker"

export function CustomReportBuilder() {
  const [reportName, setReportName] = useState("")
  const [reportType, setReportType] = useState("financial")
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["revenue", "expenses", "profit"])
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(["month"])
  const [visualizationType, setVisualizationType] = useState("table")
  const { toast } = useToast()

  const metrics = [
    { id: "revenue", label: "Revenue" },
    { id: "expenses", label: "Expenses" },
    { id: "profit", label: "Profit" },
    { id: "assets", label: "Assets" },
    { id: "liabilities", label: "Liabilities" },
    { id: "equity", label: "Equity" },
    { id: "cash_flow", label: "Cash Flow" },
    { id: "transaction_count", label: "Transaction Count" },
    { id: "average_transaction", label: "Average Transaction Value" },
  ]

  const dimensions = [
    { id: "day", label: "Day" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
    { id: "quarter", label: "Quarter" },
    { id: "year", label: "Year" },
    { id: "category", label: "Category" },
    { id: "account", label: "Account" },
    { id: "transaction_type", label: "Transaction Type" },
  ]

  const handleSaveReport = () => {
    if (!reportName) {
      toast({
        title: "Report name required",
        description: "Please enter a name for your report",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Report saved",
      description: `Your report "${reportName}" has been saved successfully.`,
    })
  }

  const handleGenerateReport = () => {
    toast({
      title: "Generating report",
      description: "Your custom report is being generated...",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Custom Report Builder</h1>
          <p className="text-muted-foreground">Create customized reports tailored to your needs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveReport}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
          <Button onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Define the parameters for your custom report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input
                    id="report-name"
                    placeholder="Enter report name"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Financial Statement</SelectItem>
                      <SelectItem value="transaction">Transaction Analysis</SelectItem>
                      <SelectItem value="tax">Tax Report</SelectItem>
                      <SelectItem value="performance">Performance Metrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <DatePickerWithRange date={date} setDate={setDate} />
              </div>

              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                  <TabsTrigger value="filters">Filters</TabsTrigger>
                </TabsList>
                <TabsContent value="metrics" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {metrics.map((metric) => (
                      <div key={metric.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`metric-${metric.id}`}
                          checked={selectedMetrics.includes(metric.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMetrics([...selectedMetrics, metric.id])
                            } else {
                              setSelectedMetrics(selectedMetrics.filter((id) => id !== metric.id))
                            }
                          }}
                        />
                        <Label htmlFor={`metric-${metric.id}`}>{metric.label}</Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="dimensions" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {dimensions.map((dimension) => (
                      <div key={dimension.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dimension-${dimension.id}`}
                          checked={selectedDimensions.includes(dimension.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedDimensions([...selectedDimensions, dimension.id])
                            } else {
                              setSelectedDimensions(selectedDimensions.filter((id) => id !== dimension.id))
                            }
                          }}
                        />
                        <Label htmlFor={`dimension-${dimension.id}`}>{dimension.label}</Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="filters" className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Add filters to refine your report data</p>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-3 w-3" />
                      Add Filter
                    </Button>
                  </div>
                  <div className="rounded-md border border-dashed p-8 text-center">
                    <Filter className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">No filters added</p>
                    <p className="text-xs text-muted-foreground">Add filters to narrow down your report data</p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="visualization">Visualization Type</Label>
                <Select value={visualizationType} onValueChange={setVisualizationType}>
                  <SelectTrigger id="visualization">
                    <SelectValue placeholder="Select visualization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Report preview based on your configuration</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              {visualizationType === "table" && (
                <div className="w-full text-center text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4" />
                  <p>Table preview will appear here after generating the report</p>
                </div>
              )}
              {visualizationType === "bar" && (
                <div className="w-full text-center text-muted-foreground">
                  <BarChart className="mx-auto h-12 w-12 mb-4" />
                  <p>Bar chart preview will appear here after generating the report</p>
                </div>
              )}
              {visualizationType === "pie" && (
                <div className="w-full text-center text-muted-foreground">
                  <PieChart className="mx-auto h-12 w-12 mb-4" />
                  <p>Pie chart preview will appear here after generating the report</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Templates</CardTitle>
              <CardDescription>Your previously saved report templates</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="font-medium">Monthly P&L Summary</div>
                    <div className="text-sm text-muted-foreground">Financial Statement</div>
                  </div>
                  <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="font-medium">Quarterly Revenue by Category</div>
                    <div className="text-sm text-muted-foreground">Transaction Analysis</div>
                  </div>
                  <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="font-medium">Annual Tax Summary</div>
                    <div className="text-sm text-muted-foreground">Tax Report</div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Export your report in different formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export as Excel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
                <Separator className="my-2" />
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

