'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Mail } from 'lucide-react';

interface InvoiceItem {
  name: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: {
    name: string;
    email: string;
    address?: string;
  };
  issueDate: string;
  dueDate: string;
  status: 'DUE' | 'PAID';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}

interface InvoiceViewModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceViewModal({
  invoice,
  isOpen,
  onClose,
}: InvoiceViewModalProps) {
  if (!invoice) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const handleSendEmail = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/send-email`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send invoice email');
      }
    } catch (error) {
      console.error('Error sending invoice email:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Invoice #{invoice.invoiceNumber}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Customer Details</h3>
            <div className="space-y-1">
              <p>{invoice.customer.name}</p>
              <p>{invoice.customer.email}</p>
              {invoice.customer.address && <p>{invoice.customer.address}</p>}
            </div>
          </div>

          <div className="text-right">
            <h3 className="font-semibold mb-2">Invoice Details</h3>
            <div className="space-y-1">
              <p>Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
              <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              <p>Status: {invoice.status}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-4">Items</h3>
          <div className="border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Item</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-right p-4">Quantity</th>
                  <th className="text-right p-4">Rate</th>
                  <th className="text-right p-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.description}</td>
                    <td className="p-4 text-right">{item.quantity}</td>
                    <td className="p-4 text-right">${item.rate.toFixed(2)}</td>
                    <td className="p-4 text-right">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-gray-600">{invoice.notes}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Send to Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 