"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
    items: [
      {
        title: "Account",
        href: "/settings",
      },
      {
        title: "Appearance",
        href: "/settings/appearance",
      },
      {
        title: "Notifications",
        href: "/settings/notifications",
      },
    ],
  },
  {
    title: "Billing",
    href: "/settings/billing",
    items: [
      {
        title: "Plans",
        href: "/settings/billing",
      },
      {
        title: "Payment Methods",
        href: "/settings/billing/payment-methods",
      },
      {
        title: "Invoices",
        href: "/settings/billing/invoices",
      },
    ],
  },
  {
    title: "Preferences",
    href: "/settings/preferences",
    items: [
      {
        title: "Currency",
        href: "/settings/preferences/currency",
      },
      {
        title: "Language",
        href: "/settings/preferences/language",
      },
      {
        title: "Time Zone",
        href: "/settings/preferences/timezone",
      },
    ],
  },
]

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="space-y-6 lg:space-y-8">
      {sidebarNavItems.map((section) => (
        <div key={section.title} className="space-y-3">
          <h4 className="font-medium">{section.title}</h4>
          <div className="grid gap-1">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm hover:bg-accent",
                  pathname === item.href ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground",
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

