import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    const invoice = await prisma.invoice.update({
      where: {
        id: params.invoiceId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error updating invoice status:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 