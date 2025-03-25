import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CreateInvoiceForm } from "./create-invoice-form";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CreateInvoicePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Check if user has a business
  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
  });

  if (!business) {
    redirect("/onboarding"); // Redirect to business setup/onboarding
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Create Invoice"
            description="Create a new invoice for your customer"
          />
        </div>
        <Separator />
        <CreateInvoiceForm />
      </div>
    </div>
  );
} 