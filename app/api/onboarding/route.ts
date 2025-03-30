import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { onboardingSchema } from '@/lib/validations/business';

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request data
    const data = await req.json();
    const validationResult = onboardingSchema.safeParse(data);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed',
        details: validationResult.error.errors 
      }, { status: 400 });
    }

    const {
      businessInfo,
      financialGoals,
      assets,
      liabilities,
      equity
    } = validationResult.data;

    // Create or update business profile
    const business = await prisma.business.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        name: businessInfo.name,
        industry: businessInfo.industry,
        size: businessInfo.size,
        startDate: businessInfo.startDate,
        taxIdentifier: businessInfo.taxIdentifier,
        businessType: businessInfo.businessType,
        address: businessInfo.address,
        phone: businessInfo.phone,
        email: businessInfo.email,
        website: businessInfo.website,
        fiscalYearEnd: businessInfo.fiscalYearEnd,
        accountingMethod: businessInfo.accountingMethod,
      },
      create: {
        userId: session.user.id,
        name: businessInfo.name,
        industry: businessInfo.industry,
        size: businessInfo.size,
        startDate: businessInfo.startDate,
        taxIdentifier: businessInfo.taxIdentifier,
        businessType: businessInfo.businessType,
        address: businessInfo.address,
        phone: businessInfo.phone,
        email: businessInfo.email,
        website: businessInfo.website,
        fiscalYearEnd: businessInfo.fiscalYearEnd,
        accountingMethod: businessInfo.accountingMethod,
      }
    });

    // Delete existing records before creating new ones
    await Promise.all([
      prisma.financialGoal.deleteMany({ where: { businessId: business.id } }),
      prisma.asset.deleteMany({ where: { businessId: business.id } }),
      prisma.liability.deleteMany({ where: { businessId: business.id } }),
      prisma.equityDetail.deleteMany({ where: { businessId: business.id } }),
    ]);

    // Create financial goals
    if (financialGoals?.length) {
      await prisma.financialGoal.createMany({
        data: financialGoals.map((goal) => ({
          ...goal,
          businessId: business.id
        }))
      });
    }

    // Create assets
    if (assets?.length) {
      await prisma.asset.createMany({
        data: assets.map((asset) => ({
          ...asset,
          businessId: business.id
        }))
      });
    }

    // Create liabilities
    if (liabilities?.length) {
      await prisma.liability.createMany({
        data: liabilities.map((liability) => ({
          ...liability,
          businessId: business.id
        }))
      });
    }

    // Create equity details
    if (equity?.length) {
      await prisma.equityDetail.createMany({
        data: equity.map((item) => ({
          ...item,
          businessId: business.id
        }))
      });
    }

    return NextResponse.json({ 
      success: true, 
      business,
      message: "Onboarding data saved successfully" 
    });
  } catch (error) {
    console.error('Onboarding Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 