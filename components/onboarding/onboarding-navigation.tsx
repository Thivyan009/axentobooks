"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OnboardingNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
}

export function OnboardingNavigation({ currentStep, totalSteps, onNext, onBack }: OnboardingNavigationProps) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>
      <div className="text-sm text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}
      </div>
      <Button onClick={onNext} className="flex items-center gap-2">
        Continue
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

