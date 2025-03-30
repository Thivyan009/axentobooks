'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  BarChart3,
  MessageSquare,
  Bell,
  Settings,
  CreditCard,
  Tag,
} from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/admin",
    icon: BarChart3,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Revenue Analytics",
    href: "/admin/revenue",
    icon: CreditCard,
  },
  {
    name: "Support Tickets",
    href: "/admin/support",
    icon: MessageSquare,
  },
  {
    name: "Announcements",
    href: "/admin/announcements",
    icon: Bell,
  },
  {
    name: "Promotions",
    href: "/admin/promotions",
    icon: Tag,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center justify-center border-b px-4">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-gray-500"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 