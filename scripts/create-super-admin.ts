import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@axento.com'
  const password = 'Admin@123' // You should change this password immediately after first login
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: 'SUPER_ADMIN',
      },
      create: {
        email,
        name: 'Super Admin',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    })

    console.log('Super admin user created/updated:', user)
  } catch (error) {
    console.error('Error creating super admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 