import type { ReactNode } from "react"
import { OnboardingBackground } from "@/components/onboarding/onboarding-background"

interface OnboardingLayoutProps {
  children: ReactNode
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/10">
      <main className="container relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-6">
        <OnboardingBackground />
        {children}
      </main>
    </div>
  )
}

