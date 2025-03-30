import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    });

    if (!settings) {
      // Create default settings if they don't exist
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          theme: 'light',
          currency: 'USD',
          language: 'en',
          notificationPrefs: {
            email: true,
            push: true,
            transactionAlerts: true,
            reportReminders: true,
            aiInsights: true
          }
        }
      });

      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Get Settings Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, company, role, bio } = body;

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        company,
        role,
        bio,
      },
    });

    // Update session
    session.user = {
      ...session.user,
      ...updatedUser,
    };

    return NextResponse.json({
      user: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update Settings Error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 