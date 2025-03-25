"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Building2, 
  ChevronDown, 
  LayoutDashboard, 
  LineChart, 
  Receipt, 
  Settings, 
  Calendar,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: LineChart,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: Receipt,
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
    name: "Invoices",
    href: "/invoices",
    icon: FileText,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="none" className="w-64">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
        </div>
      </SidebarHeader>
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

