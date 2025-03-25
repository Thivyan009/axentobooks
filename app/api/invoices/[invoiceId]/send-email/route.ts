import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(
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

    // Generate PDF (you'll need to implement this)
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: invoice.customer.email,
      subject: `Invoice #${invoice.invoiceNumber} from ${invoice.businessId}`,
      html: `
        <h1>Invoice #${invoice.invoiceNumber}</h1>
        <p>Dear ${invoice.customer.name},</p>
        <p>Please find attached your invoice for the following items:</p>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${item.rate.toFixed(2)}</td>
                <td>$${item.amount.toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <p>Subtotal: $${invoice.subtotal.toFixed(2)}</p>
        <p>Tax: $${invoice.tax.toFixed(2)}</p>
        <p><strong>Total: $${invoice.total.toFixed(2)}</strong></p>
        <p>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p>Thank you for your business!</p>
      `,
      attachments: [
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return new NextResponse('Email sent successfully', { status: 200 });
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function generateInvoicePDF(invoice: any) {
  // Implement PDF generation using a library like PDFKit or jsPDF
  // This is a placeholder function
  return Buffer.from('PDF content would go here');
} 