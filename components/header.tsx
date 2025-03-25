"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { CommandMenu } from "@/components/command-menu"
import { NotificationBell } from "./notifications/notification-bell"
import { CurrencySwitcher } from "./currency-switcher"

export function Header() {
  const { theme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src={theme === 'dark' ? "/axento books white.png" : "/axento books light mode.png"}
              alt="Axento Books Logo"
              width={240}
              height={48}
              className="h-12 w-auto"
              priority
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <div className="w-[200px] md:w-[300px]">
            <CommandMenu />
          </div>
        </div>
        <nav className="flex items-center gap-1 mr-2">
          <CurrencySwitcher />
          <ThemeToggle />
          <NotificationBell />
          <UserNav />
        </nav>
      </div>
    </header>
  )
}

