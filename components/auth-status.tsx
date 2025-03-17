"use client"

import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export function AuthStatus() {
  const { status } = useSession()

  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return null
} 