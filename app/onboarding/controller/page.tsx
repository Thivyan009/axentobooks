"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import { useToast } from "@/components/ui/use-toast"

export default function OnboardingControllerPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }
  }, [status, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    return null
  }

  return <OnboardingForm />
}

