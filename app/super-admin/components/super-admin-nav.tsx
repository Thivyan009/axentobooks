"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  LineChart,
  Receipt,
  FileText,
  CalendarDays,
  FileBarChart,
  Settings,
  MessageSquare,
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/super-admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/super-admin/analytics",
    icon: LineChart,
  },
  {
    title: "Transactions",
    href: "/super-admin/transactions",
    icon: Receipt,
  },
  {
    title: "Invoices",
    href: "/super-admin/invoices",
    icon: FileText,
  },
  {
    title: "Calendar",
    href: "/super-admin/calendar",
    icon: CalendarDays,
  },
  {
    title: "Reports",
    href: "/super-admin/reports",
    icon: FileBarChart,
  },
  {
    title: "Settings",
    href: "/super-admin/settings",
    icon: Settings,
  },
  {
    title: "Beta Feedback",
    href: "/super-admin/feedback",
    icon: MessageSquare,
  },
]

export function SuperAdminNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-foreground",
              pathname === item.href 
                ? "bg-muted font-medium text-foreground" 
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}