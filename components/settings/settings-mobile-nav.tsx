"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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

export function SettingsMobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
          <div className="flex flex-col space-y-3">
            {sidebarNavItems.map((section) => (
              <div key={section.title} className="space-y-3">
                <h4 className="font-medium">{section.title}</h4>
                <div className="grid gap-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex w-full items-center rounded-md p-2 text-sm",
                        pathname === item.href ? "bg-muted font-medium text-primary" : "text-muted-foreground",
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

