"use client"

import { useState, useEffect } from "react"

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const totalSteps = 5 // Total number of steps in the onboarding process

  // Check if onboarding is completed from localStorage on mount
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboarding_completed")
    if (onboardingCompleted === "true") {
      setIsCompleted(true)
    }
  }, [])

  // Set the current step
  const setStep = (step: number) => {
    setCurrentStep(step)
  }

  // Mark onboarding as completed
  const completeOnboarding = () => {
    localStorage.setItem("onboarding_completed", "true")
    setIsCompleted(true)
  }

  // Restart the onboarding process
  const restartOnboarding = () => {
    setCurrentStep(0)
    setIsCompleted(false)
    localStorage.removeItem("onboarding_completed")
  }

  return {
    currentStep,
    totalSteps,
    isCompleted,
    setStep,
    completeOnboarding,
    restartOnboarding,
  }
}

