import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { customerId, issueDate, dueDate, items, notes } = body;

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
    const tax = subtotal * 0.1; // 10% tax rate
    const total = subtotal + tax;

    // Generate invoice number (you might want to implement a more sophisticated system)
    const invoiceNumber = `INV-${Date.now()}`;

    // Create invoice with items in a transaction
    const invoice = await prisma.$transaction(async (tx) => {
      const newInvoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          issueDate: new Date(issueDate),
          dueDate: new Date(dueDate),
          status: 'DUE',
          subtotal,
          tax,
          total,
          notes,
          businessId: params.businessId,
          customerId,
          items: {
            create: items.map((item: any) => ({
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              rate: item.rate,
              amount: item.amount,
            })),
          },
        },
        include: {
          customer: true,
          items: true,
        },
      });

      return newInvoice;
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          error: "Failed to create invoice",
          details: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('Fetching invoices for business:', params.businessId); // Debug log

    // First, verify the business exists and belongs to the user
    const business = await prisma.business.findFirst({
      where: {
        id: params.businessId,
        userId: session.user.id,
      },
    });

    if (!business) {
      console.error('Business not found or unauthorized:', params.businessId);
      return NextResponse.json({ error: "Business not found or unauthorized" }, { status: 404 });
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        businessId: params.businessId,
      },
      include: {
        customer: true,
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('Found invoices:', invoices.length); // Debug log
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          error: "Failed to fetch invoices",
          details: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
} 