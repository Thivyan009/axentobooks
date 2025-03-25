import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [totalUsers, totalBusinesses, totalReports] = await Promise.all([
      prisma.user.count(),
      prisma.business.count(),
      prisma.report.count(),
    ]);

    return NextResponse.json({
      totalUsers,
      totalBusinesses,
      totalReports,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 