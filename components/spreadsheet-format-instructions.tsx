import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SpreadsheetFormatInstructions() {
  const handleDownloadTemplate = () => {
    const csvContent = `date,name,description,amount,category,type,accountType,notes
2024-03-01,Office Supplies,Monthly office supplies purchase,150.00,Office Supplies,expense,cash,Monthly supplies
2024-03-02,Client Payment,Payment for consulting services,2500.00,Consulting,income,bank,Client invoice #123
2024-03-03,Utility Bill,Electricity bill payment,200.00,Utilities,expense,bank,March electricity
2024-03-04,Marketing Campaign,Digital marketing campaign,500.00,Marketing,expense,credit,Facebook ads
2024-03-05,Product Sales,Product sales revenue,1200.00,Sales,income,cash,Store sales`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transaction-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          Spreadsheet Format Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl">Spreadsheet Format Guide</DialogTitle>
          <DialogDescription>
            Your spreadsheet must follow this format for successful transaction import.
            Download the template below to get started quickly.
          </DialogDescription>
          <Button onClick={handleDownloadTemplate} variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Required Columns</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column Name</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Example</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>date</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Transaction date in YYYY-MM-DD format</TableCell>
                  <TableCell>2024-03-01</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>name</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Transaction name/title</TableCell>
                  <TableCell>Office Supplies</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>description</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Detailed description of the transaction</TableCell>
                  <TableCell>Monthly office supplies purchase</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>amount</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Transaction amount (positive number)</TableCell>
                  <TableCell>150.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>category</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Transaction category</TableCell>
                  <TableCell>Office Supplies</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>type</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Transaction type (expense or income)</TableCell>
                  <TableCell>expense</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>accountType</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Account type (cash, bank, or credit)</TableCell>
                  <TableCell>cash</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>notes</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Additional notes or reference</TableCell>
                  <TableCell>Monthly supplies</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Example Data</h3>
            <div className="bg-muted p-6 rounded-lg overflow-x-auto">
              <pre className="text-sm whitespace-pre-wrap">
{`Date,Name,Description,Amount,Category,Type,Account Type,Notes
2024-03-01,Office Supplies,Monthly office supplies purchase,150.00,Office Supplies,expense,cash,Monthly supplies
2024-03-02,Client Payment,Payment for consulting services,2500.00,Consulting,income,bank,Client invoice #123
2024-03-03,Utility Bill,Electricity bill payment,200.00,Utilities,expense,bank,March electricity,Monthly supplies
2024-03-04,Marketing Campaign,Digital marketing campaign,500.00,Marketing,expense,credit,Facebook ads,Digital marketing campaign
2024-03-05,Product Sales,Product sales revenue,1200.00,Sales,income,cash,Store sales,Product sales revenue`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Important Notes</h3>
            <ul className="list-disc list-inside space-y-3 text-sm">
              <li>Save your spreadsheet as a CSV file</li>
              <li>Use consistent date formatting (YYYY-MM-DD)</li>
              <li>Use decimal points for amounts (e.g., 1500.00)</li>
              <li>Account Type must be exactly one of: cash, bank, or credit</li>
              <li>Make sure there are no empty rows</li>
              <li>Categories should match your existing transaction categories</li>
              <li>Type must be either 'income' or 'expense' (case-sensitive)</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 