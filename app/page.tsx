"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.replace("/auth/signin")
      return
    }

    try {
      const onboardingComplete = localStorage.getItem("onboarding_complete") === "true"
      if (!onboardingComplete) {
        router.replace("/onboarding/controller")
      } else {
        router.replace("/dashboard")
      }
    } catch (error) {
      // If localStorage is not available, redirect to onboarding
      router.replace("/onboarding/controller")
    }
  }, [router, status])

  // Return loading state while checking
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

