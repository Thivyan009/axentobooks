const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Update all users to be active
    const result = await prisma.user.updateMany({
      data: {
        isActive: true,
        lastLoginAt: new Date(),
      },
    });
    
    console.log(`Updated ${result.count} users to be active`);
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 