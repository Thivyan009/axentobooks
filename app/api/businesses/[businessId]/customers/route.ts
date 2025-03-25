import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, address } = body;

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        businessId: params.businessId,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const customers = await prisma.customer.findMany({
      where: {
        businessId: params.businessId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 