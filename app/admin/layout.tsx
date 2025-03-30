import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Sidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Check if user is admin
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
  })

  if (!user?.isAdmin) {
    redirect("/dashboard")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
} 