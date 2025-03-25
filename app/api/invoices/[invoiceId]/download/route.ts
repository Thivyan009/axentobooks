import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PDFDocument from 'pdfkit';

export async function GET(
  request: Request,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: params.invoiceId,
      },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!invoice) {
      return new NextResponse('Invoice not found', { status: 404 });
    }

    // Create PDF document
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    // Collect PDF data chunks
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {});

    // Add content to PDF
    doc
      .fontSize(20)
      .text(`Invoice #${invoice.invoiceNumber}`, { align: 'center' })
      .moveDown();

    // Customer details
    doc
      .fontSize(12)
      .text('Customer Details')
      .fontSize(10)
      .text(invoice.customer.name)
      .text(invoice.customer.email)
      .text(invoice.customer.address || '')
      .moveDown();

    // Invoice details
    doc
      .fontSize(12)
      .text('Invoice Details')
      .fontSize(10)
      .text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`)
      .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`)
      .text(`Status: ${invoice.status}`)
      .moveDown();

    // Items table
    const tableTop = doc.y;
    let currentTop = tableTop;

    // Table headers
    doc
      .fontSize(10)
      .text('Item', 50, currentTop)
      .text('Description', 200, currentTop)
      .text('Quantity', 350, currentTop)
      .text('Rate', 400, currentTop)
      .text('Amount', 450, currentTop);

    currentTop += 20;

    // Table rows
    invoice.items.forEach((item) => {
      if (currentTop > 700) {
        doc.addPage();
        currentTop = 50;
      }

      doc
        .text(item.name, 50, currentTop)
        .text(item.description || '', 200, currentTop)
        .text(item.quantity.toString(), 350, currentTop)
        .text(`$${item.rate.toFixed(2)}`, 400, currentTop)
        .text(`$${item.amount.toFixed(2)}`, 450, currentTop);

      currentTop += 20;
    });

    // Totals
    currentTop += 20;
    doc
      .text('Subtotal:', 350, currentTop)
      .text(`$${invoice.subtotal.toFixed(2)}`, 450, currentTop);

    currentTop += 20;
    doc
      .text('Tax:', 350, currentTop)
      .text(`$${invoice.tax.toFixed(2)}`, 450, currentTop);

    currentTop += 20;
    doc
      .fontSize(12)
      .text('Total:', 350, currentTop)
      .text(`$${invoice.total.toFixed(2)}`, 450, currentTop);

    // Notes
    if (invoice.notes) {
      currentTop += 40;
      doc
        .fontSize(10)
        .text('Notes:', 50, currentTop)
        .text(invoice.notes, 50, currentTop + 20);
    }

    // Finalize PDF
    doc.end();

    // Wait for PDF generation to complete
    await new Promise((resolve) => {
      doc.on('end', resolve);
    });

    // Combine chunks into a single buffer
    const pdfBuffer = Buffer.concat(chunks);

    // Return PDF with appropriate headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`,
      },
    });
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 