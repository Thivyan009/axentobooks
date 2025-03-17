"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import { useToast } from "@/components/ui/use-toast"

export default function OnboardingControllerPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/auth/signin")
      return
    }
  }, [session, router])

  if (!session?.user?.id) {
    return null
  }

  return <OnboardingForm />
}

