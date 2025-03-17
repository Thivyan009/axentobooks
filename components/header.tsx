import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { CommandMenu } from "@/components/command-menu"
import { NotificationBell } from "./notifications/notification-bell"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/axento books.png"
              alt="Axento Books Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <div className="w-[200px] md:w-[300px]">
            <CommandMenu />
          </div>
        </div>
        <nav className="flex items-center gap-1 mr-2">
          <ThemeToggle />
          <NotificationBell />
          <UserNav />
        </nav>
      </div>
    </header>
  )
}

