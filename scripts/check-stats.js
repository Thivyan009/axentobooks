const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get stats
    const [totalUsers, activeUsers, totalBusinesses, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: twentyFourHoursAgo,
          },
          isActive: true,
        },
      }),
      prisma.business.count(),
      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: "INCOME",
        },
      }),
    ]);

    console.log({
      totalUsers,
      activeUsers,
      totalBusinesses,
      revenue: revenue._sum.amount || 0,
    });

    // Check user roles
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });
    console.log('\nUsers by role:', usersByRole);

    // Check active status
    const activeStatus = await prisma.user.groupBy({
      by: ['isActive'],
      _count: true,
    });
    console.log('\nUsers by active status:', activeStatus);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 