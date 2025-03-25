"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Building2, ChevronDown, FileText, LayoutDashboard, Receipt, Settings, Calendar, FileSpreadsheet, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { BusinessName } from "@/components/layouts/business-name"
import { Suspense } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: Receipt,
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: FileSpreadsheet,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Beta Feedback",
    href: "/feedback",
    icon: MessageSquare,
  },
]

export function PageSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="none" className="w-64">
      <SidebarHeader className="p-4">
        <Suspense fallback={
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <div>
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
        }>
          <BusinessName />
        </Suspense>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href} className="flex items-center gap-x-3">
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

