import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function createCustomer(data: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
  });

  if (!business) {
    throw new Error("Business not found");
  }

  return prisma.customer.create({
    data: {
      ...data,
      businessId: business.id,
    },
  });
}

export async function getCustomers() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
  });

  if (!business) {
    throw new Error("Business not found");
  }

  return prisma.customer.findMany({
    where: { businessId: business.id },
    orderBy: { name: "asc" },
  });
} 