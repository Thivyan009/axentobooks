import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  try {
    // Get the first business
    const business = await prisma.business.findFirst();
    
    if (!business) {
      console.error('No business found. Please create a business first.');
      return;
    }

    // Create sample bank statements
    const statements = await Promise.all([
      prisma.bankStatement.create({
        data: {
          fileName: `${uuidv4()}.pdf`,
          originalName: 'March-2024-Statement.pdf',
          status: 'pending',
          businessId: business.id,
          month: new Date('2024-03-01'),
        },
      }),
      prisma.bankStatement.create({
        data: {
          fileName: `${uuidv4()}.pdf`,
          originalName: 'February-2024-Statement.pdf',
          status: 'pending',
          businessId: business.id,
          month: new Date('2024-02-01'),
        },
      }),
      prisma.bankStatement.create({
        data: {
          fileName: `${uuidv4()}.pdf`,
          originalName: 'January-2024-Statement.pdf',
          status: 'pending',
          businessId: business.id,
          month: new Date('2024-01-01'),
        },
      }),
    ]);

    console.log('Created sample bank statements:', statements.length);
  } catch (error) {
    console.error('Error seeding bank statements:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 