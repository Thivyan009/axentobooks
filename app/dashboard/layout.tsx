import type React from "react"
import { Header } from "@/components/header"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <div className="flex-1">
          <Header />
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}

