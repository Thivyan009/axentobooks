import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      onboardingCompleted: userSettings?.onboardingCompleted ?? false,
    });
  } catch (error) {
    console.error("Failed to check onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to check onboarding status" },
      { status: 500 }
    );
  }
}
