'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, Download, Mail, AlertCircle } from 'lucide-react';
import { InvoiceViewModal } from './InvoiceViewModal';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: {
    name: string;
    email: string;
  };
  issueDate: string;
  dueDate: string;
  status: 'DUE' | 'PAID';
  total: number;
}

interface InvoiceListProps {
  businessId: string;
}

export function InvoiceList({ businessId }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, [businessId]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/businesses/${businessId}/invoices`);
      if (!response.ok) {
        throw new Error(`Failed to fetch invoices: ${response.statusText}`);
      }
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Failed to load invoices. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load invoices. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (invoiceId: string, newStatus: 'DUE' | 'PAID') => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update invoice status: ${response.statusText}`);
      }

      setInvoices(
        invoices.map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
        )
      );
      toast({
        title: "Success",
        description: "Invoice status updated successfully",
      });
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/download`);
      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Success",
        description: "Invoice downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        title: "Error",
        description: "Failed to download invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/send-email`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to send invoice email: ${response.statusText}`);
      }

      toast({
        title: "Success",
        description: "Invoice email sent successfully",
      });
    } catch (error) {
      console.error('Error sending invoice email:', error);
      toast({
        title: "Error",
        description: "Failed to send invoice email. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No invoices found. Create your first invoice to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>
                {invoice.customer.name}
                <br />
                <span className="text-sm text-gray-500">{invoice.customer.email}</span>
              </TableCell>
              <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Select
                  value={invoice.status}
                  onValueChange={(value: 'DUE' | 'PAID') =>
                    handleStatusChange(invoice.id, value)
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DUE">Due</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>${invoice.total.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setIsViewModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(invoice.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSendEmail(invoice.id)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <InvoiceViewModal
        invoice={selectedInvoice}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedInvoice(null);
        }}
      />
    </div>
  );
} 