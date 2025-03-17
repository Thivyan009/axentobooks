import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { categorizeTransaction, updateFinancialPosition } from "@/lib/actions/reports"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    // Get user's business
    const business = await prisma.business.findUnique({
      where: { userId: session.user.id }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Build filter conditions
    const where: any = {
      businessId: business.id
    };

    if (type) where.type = type;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Get transactions with pagination
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          revenueSource: true,
          expenseCategory: true,
          attachments: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' }
      }),
      prisma.transaction.count({ where })
    ]);

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Transactions Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get business ID for the user
    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
    })

    if (!business) {
      return new NextResponse("Business not found", { status: 404 })
    }

    // Get transaction details from request
    const { date, type, amount, category, description } = await req.json()
    console.log("Creating transaction with data:", { date, type, amount, category, description })

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        type,
        amount,
        category,
        description,
        businessId: business.id,
        userId: session.user.id,
      },
    })
    console.log("Transaction created successfully:", transaction)

    // Send transaction to Gemini AI for categorization
    console.log("Sending transaction to Gemini AI for categorization...")
    const aiCategory = await categorizeTransaction({
      date: new Date(date),
      type,
      amount,
      category,
      description,
    })
    console.log("AI Categorization result:", aiCategory)

    // Update financial position based on AI categorization
    console.log("Updating financial position...")
    const updateResult = await updateFinancialPosition(business.id, {
      date: new Date(date),
      type,
      amount,
      category,
      description,
    }, aiCategory)
    console.log("Financial position update result:", updateResult)

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("[TRANSACTIONS_POST] Error details:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 