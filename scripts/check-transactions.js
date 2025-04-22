const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Get transaction types
    const transactionTypes = await prisma.transaction.groupBy({
      by: ['type'],
      _count: true,
      _sum: {
        amount: true,
      },
    });
    
    console.log('Transaction types:', transactionTypes);

    // Get a sample transaction
    const sampleTransaction = await prisma.transaction.findFirst({
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        category: true,
      },
    });
    
    console.log('\nSample transaction:', sampleTransaction);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 