import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const {
      businessInfo,
      financialGoals,
      assets,
      liabilities,
      equityDetails,
      revenueSources,
      expenseCategories
    } = data;

    // Create or update business profile
    const business = await prisma.business.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        name: businessInfo.name,
        industry: businessInfo.industry,
        registrationNo: businessInfo.registrationNo,
        taxId: businessInfo.taxId
      },
      create: {
        userId: session.user.id,
        name: businessInfo.name,
        industry: businessInfo.industry,
        registrationNo: businessInfo.registrationNo,
        taxId: businessInfo.taxId
      }
    });

    // Create financial goals
    if (financialGoals?.length) {
      await prisma.financialGoal.createMany({
        data: financialGoals.map((goal: any) => ({
          ...goal,
          businessId: business.id
        }))
      });
    }

    // Create assets
    if (assets?.length) {
      await prisma.asset.createMany({
        data: assets.map((asset: any) => ({
          ...asset,
          businessId: business.id
        }))
      });
    }

    // Create liabilities
    if (liabilities?.length) {
      await prisma.liability.createMany({
        data: liabilities.map((liability: any) => ({
          ...liability,
          businessId: business.id
        }))
      });
    }

    // Create equity details
    if (equityDetails?.length) {
      await prisma.equityDetail.createMany({
        data: equityDetails.map((equity: any) => ({
          ...equity,
          businessId: business.id
        }))
      });
    }

    // Create revenue sources
    if (revenueSources?.length) {
      await prisma.revenueSource.createMany({
        data: revenueSources.map((source: any) => ({
          ...source,
          businessId: business.id
        }))
      });
    }

    // Create expense categories
    if (expenseCategories?.length) {
      await prisma.expenseCategory.createMany({
        data: expenseCategories.map((category: any) => ({
          ...category,
          businessId: business.id
        }))
      });
    }

    return NextResponse.json({ success: true, business });
  } catch (error) {
    console.error('Onboarding Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 