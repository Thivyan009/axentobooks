import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { categorizeTransaction, updateFinancialPosition } from "@/lib/actions/reports"
import { auth } from "@/lib/auth"
import { analyzeTransaction, updateFinancialStatements } from "@/lib/actions/transaction-analysis"

interface TransactionRequest {
  date: string
  type: string
  amount: number
  category: string
  description: string
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(searchParams.get('limit') || '10', 10);
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
  } catch (error: unknown) {
    console.error('[TRANSACTIONS_GET] Error details:', error);
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
    const { date, type, amount, category, description } = await req.json() as TransactionRequest
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
        accountType: "cash", // Default account type
      },
    })
    console.log("Transaction created successfully:", transaction)

    // Analyze transaction using Gemini AI
    console.log("Analyzing transaction with Gemini AI...")
    try {
      const analysis = await analyzeTransaction({
        date: new Date(date),
        type,
        amount,
        category,
        description,
      })
      console.log("AI Analysis result:", analysis)

      // Update transaction with AI analysis results
      const updatedTransaction = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          aiConfidence: analysis.confidence,
          notes: analysis.description,
        },
      })
      console.log("Transaction updated with AI analysis:", updatedTransaction)

      // Update financial statements based on analysis
      console.log("Updating financial statements...")
      await updateFinancialStatements(business.id, {
        id: transaction.id,
        date: new Date(date),
        type,
        amount,
        category,
        description,
      }, analysis)
      console.log("Financial statements updated successfully")

      return NextResponse.json(updatedTransaction)
    } catch (analysisError) {
      console.error("Error during transaction analysis:", analysisError)
      // Still return the created transaction even if analysis fails
      return NextResponse.json(transaction)
    }
  } catch (error: unknown) {
    console.error("[TRANSACTIONS_POST] Error details:", error)
    if (error instanceof Error) {
      console.error("Error stack trace:", error.stack)
    }
    return new NextResponse("Internal Error", { status: 500 })
  }
} 