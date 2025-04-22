import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Create super admin user
  const superAdminEmail = "thivyan@astacodelabs.com"
  
  // Check if super admin already exists
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  })

  if (!existingSuperAdmin) {
    const hashedPassword = await hash("Thivyan@09", 10)
    
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        name: "Thivyan",
        password: hashedPassword,
        role: "SUPER_ADMIN",
        settings: {
          create: {
            theme: "light",
            emailNotifications: true,
            onboardingCompleted: true,
          },
        },
      },
    })
    
    console.log("Super admin user created successfully")
  } else {
    console.log("Super admin user already exists")
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 