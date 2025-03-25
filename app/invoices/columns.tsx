import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  status: string;
  issueDate: Date;
  dueDate: Date;
  total: number;
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "PAID"
              ? "success"
              : status === "SENT"
              ? "default"
              : status === "DRAFT"
              ? "secondary"
              : "destructive"
          }
        >
          {status.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "issueDate",
    header: "Issue Date",
    cell: ({ row }) => {
      const date = row.getValue("issueDate") as Date;
      return new Date(date).toLocaleDateString();
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as Date;
      return new Date(date).toLocaleDateString();
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/invoices/${invoice.id}`}>
              <DropdownMenuItem>View Invoice</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuItem>Send to Customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 