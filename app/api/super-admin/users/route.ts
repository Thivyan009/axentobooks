import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || undefined

    const skip = (page - 1) * limit

    // Build the where clause for filtering
    const where = {
      AND: [
        {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
        role ? { role: role } : {},
      ],
    }

    // Get users with pagination and search
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          lastLoginAt: true,
          isActive: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("[SUPER_ADMIN_USERS]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { userId, updates } = body

    if (!userId || !updates) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Prevent updating super admin users
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (user?.role === "SUPER_ADMIN") {
      return new NextResponse("Cannot modify super admin users", { status: 403 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[SUPER_ADMIN_USER_UPDATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return new NextResponse("Missing user ID", { status: 400 })
    }

    // Prevent deleting super admin users
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (user?.role === "SUPER_ADMIN") {
      return new NextResponse("Cannot delete super admin users", { status: 403 })
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[SUPER_ADMIN_USER_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 