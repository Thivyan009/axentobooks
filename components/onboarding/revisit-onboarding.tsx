"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { useOnboarding } from "@/hooks/use-onboarding"

interface RevisitOnboardingProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function RevisitOnboarding({ variant = "outline", size = "default" }: RevisitOnboardingProps) {
  const { restartOnboarding } = useOnboarding()

  return (
    <Button variant={variant} size={size} onClick={restartOnboarding} className="gap-2">
      <HelpCircle className="h-4 w-4" />
      <span>Help & Tutorial</span>
    </Button>
  )
}

