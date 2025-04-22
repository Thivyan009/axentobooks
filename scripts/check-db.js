const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database...');
    
    // Check if there are any users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users in the database`);
    
    if (users.length === 0) {
      console.log('No users found. Creating test users...');
      
      // Create a super admin user
      const superAdminPassword = await bcrypt.hash('Admin@123', 10);
      const superAdmin = await prisma.user.create({
        data: {
          email: 'admin@axento.com',
          name: 'Super Admin',
          password: superAdminPassword,
          role: 'SUPER_ADMIN',
          isActive: true,
          lastLoginAt: new Date(),
        },
      });
      console.log('Created super admin user:', superAdmin.email);
      
      // Create a regular admin user
      const adminPassword = await bcrypt.hash('Admin@123', 10);
      const admin = await prisma.user.create({
        data: {
          email: 'admin2@axento.com',
          name: 'Admin User',
          password: adminPassword,
          role: 'ADMIN',
          isActive: true,
          lastLoginAt: new Date(),
        },
      });
      console.log('Created admin user:', admin.email);
      
      // Create a regular user
      const userPassword = await bcrypt.hash('User@123', 10);
      const user = await prisma.user.create({
        data: {
          email: 'user@axento.com',
          name: 'Regular User',
          password: userPassword,
          role: 'USER',
          isActive: true,
          lastLoginAt: new Date(),
        },
      });
      console.log('Created regular user:', user.email);
      
      // Create a business for the regular user
      const business = await prisma.business.create({
        data: {
          name: 'Test Business',
          industry: 'Technology',
          currency: 'USD',
          userId: user.id,
        },
      });
      console.log('Created business:', business.name);
      
      // Create a transaction for the business
      const transaction = await prisma.transaction.create({
        data: {
          type: 'INCOME',
          amount: 1000,
          description: 'Test transaction',
          businessId: business.id,
          category: 'SALES',
          date: new Date(),
          accountType: 'CASH',
        },
      });
      console.log('Created transaction:', transaction.id);
    } else {
      console.log('Users found in the database:');
      for (const user of users) {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role || 'USER'}`);
      }
    }
    
    // Check if there are any businesses
    const businesses = await prisma.business.findMany();
    console.log(`Found ${businesses.length} businesses in the database`);
    
    // Check if there are any transactions
    const transactions = await prisma.transaction.findMany();
    console.log(`Found ${transactions.length} transactions in the database`);
    
    console.log('Database check completed.');
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 