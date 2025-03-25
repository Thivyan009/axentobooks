import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface InvoiceItem {
  name: string;
  description?: string;
  quantity: number;
  rate: number;
}

interface CreateInvoiceData {
  customerId: string;
  dueDate: Date;
  items: InvoiceItem[];
  notes?: string;
}

function generateInvoiceNumber() {
  const prefix = "INV";
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
}

export async function createInvoice(data: CreateInvoiceData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
  });

  if (!business) {
    throw new Error("Business not found");
  }

  const subtotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  // You can customize tax calculation based on your needs
  const tax = 0;
  const total = subtotal + tax;

  return prisma.invoice.create({
    data: {
      invoiceNumber: generateInvoiceNumber(),
      customerId: data.customerId,
      businessId: business.id,
      dueDate: data.dueDate,
      subtotal,
      tax,
      total,
      notes: data.notes,
      items: {
        create: data.items.map((item) => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.quantity * item.rate,
        })),
      },
    },
    include: {
      items: true,
      customer: true,
    },
  });
}

export async function getInvoices() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
  });

  if (!business) {
    throw new Error("Business not found");
  }

  const invoices = await prisma.invoice.findMany({
    where: { businessId: business.id },
    include: {
      customer: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return invoices.map((invoice) => ({
    ...invoice,
    customerName: invoice.customer.name,
  }));
}

export async function getInvoice(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      items: true,
      business: true,
    },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  // Verify that the invoice belongs to the user's business
  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
  });

  if (!business || invoice.businessId !== business.id) {
    throw new Error("Unauthorized");
  }

  return invoice;
} 