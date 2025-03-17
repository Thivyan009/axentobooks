"use client"

import { completeOnboardingAction, resetOnboardingAction } from "@/lib/actions/onboarding"

export function useOnboardingComplete() {
  return async () => {
    await completeOnboardingAction()
  }
}

export function useResetOnboarding() {
  return async () => {
    await resetOnboardingAction()
  }
}

