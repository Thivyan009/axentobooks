import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        name: 'Demo User',
        password: hashedPassword,
      },
    });

    console.log('Created test user:', user.email);

    // Create default expense categories
    const expenseCategories = [
      { name: 'Rent', type: 'FIXED' },
      { name: 'Salaries', type: 'FIXED' },
      { name: 'Marketing', type: 'VARIABLE' },
      { name: 'Office Supplies', type: 'VARIABLE' },
      { name: 'Software', type: 'FIXED' },
    ];

    // Create default revenue sources
    const revenueSources = [
      { name: 'Product Sales', type: 'MAIN' },
      { name: 'Services', type: 'MAIN' },
      { name: 'Consulting', type: 'SECONDARY' },
      { name: 'Other Income', type: 'MISC' },
    ];

    // Create business profile
    const business = await prisma.business.create({
      data: {
        name: 'Demo Business',
        industry: 'Technology',
        registrationNo: 'REG123456',
        taxId: 'TAX123456',
        userId: user.id,
        expenseCategories: {
          createMany: {
            data: expenseCategories,
          },
        },
        revenueSources: {
          createMany: {
            data: revenueSources,
          },
        },
        financialGoals: {
          createMany: {
            data: [
              {
                title: 'Increase Revenue',
                targetAmount: 100000,
                currentAmount: 0,
                deadline: new Date('2024-12-31'),
                status: 'IN_PROGRESS',
              },
              {
                title: 'Reduce Expenses',
                targetAmount: 20000,
                currentAmount: 0,
                deadline: new Date('2024-06-30'),
                status: 'IN_PROGRESS',
              },
            ],
          },
        },
      },
    });

    console.log('Created demo business:', business.name);
    console.log('Setup completed successfully!');
    console.log('\nYou can now log in with:');
    console.log('Email: demo@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 