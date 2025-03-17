"use client"

import type React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container relative mx-auto flex min-h-screen max-w-7xl gap-8 px-6 py-8">
      <main className="flex-1">
        <ScrollArea className="h-full">{children}</ScrollArea>
      </main>
    </div>
  )
}

