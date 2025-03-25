"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Building2 } from "lucide-react"

export function BusinessName() {
  const { data: session } = useSession()
  const [businessName, setBusinessName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBusinessName() {
      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        console.log("Fetching business name...")
        const response = await fetch("/api/business/name")
        
        if (!response.ok) {
          console.error("Failed to fetch business name:", response.status, response.statusText)
          const text = await response.text()
          console.error("Response body:", text)
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("Business name response:", data)
        setBusinessName(data.name)
        setError(null)
      } catch (error) {
        console.error("Failed to fetch business name:", error)
        setError("Failed to load business name")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBusinessName()
  }, [session?.user?.id])

  if (!session?.user?.id) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-6 w-6" />
      <div>
        <h3 className="font-semibold">
          {isLoading ? (
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          ) : error ? (
            "My Business"
          ) : (
            businessName || "My Business"
          )}
        </h3>
        <p className="text-xs text-muted-foreground">Enterprise</p>
      </div>
    </div>
  )
} 