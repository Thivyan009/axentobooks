"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { WelcomeScreen } from "@/components/onboarding/steps/welcome-screen"
import { FeatureHighlight } from "@/components/onboarding/steps/feature-highlight"
import { InteractiveTutorial } from "@/components/onboarding/steps/interactive-tutorial"
import { CompletionScreen } from "@/components/onboarding/steps/completion-screen"
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress"
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation"
import { useToast } from "@/components/ui/use-toast"
import { useOnboarding } from "@/hooks/use-onboarding"

export function OnboardingController() {
  const { currentStep, totalSteps, setStep, completeOnboarding, isCompleted, restartOnboarding } = useOnboarding()
  const [direction, setDirection] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  // Define the onboarding steps and their content
  const steps = [
    {
      id: "welcome",
      component: WelcomeScreen,
      props: {
        title: "Welcome to Our Application",
        description: "Let's get you set up and familiar with the key features",
        onNext: () => handleNext(),
      },
    },
    {
      id: "dashboard",
      component: FeatureHighlight,
      props: {
        title: "Your Dashboard",
        description: "This is your central hub for all activities and insights",
        imageSrc: "/placeholder.svg?height=300&width=500",
        features: [
          { title: "Quick Overview", description: "See all your important metrics at a glance" },
          { title: "Recent Activity", description: "Track your latest actions and updates" },
          { title: "Personalized Recommendations", description: "Get suggestions based on your usage" },
        ],
        onNext: () => handleNext(),
        onBack: () => handleBack(),
      },
    },
    {
      id: "analytics",
      component: FeatureHighlight,
      props: {
        title: "Powerful Analytics",
        description: "Gain insights into your data with our comprehensive analytics tools",
        imageSrc: "/placeholder.svg?height=300&width=500",
        features: [
          { title: "Data Visualization", description: "See your data in beautiful, interactive charts" },
          { title: "Custom Reports", description: "Create reports tailored to your specific needs" },
          { title: "Export Options", description: "Download your data in various formats" },
        ],
        onNext: () => handleNext(),
        onBack: () => handleBack(),
      },
    },
    {
      id: "interactive",
      component: InteractiveTutorial,
      props: {
        title: "Try It Yourself",
        description: "Let's walk through a simple task together",
        steps: [
          { instruction: "Click on the 'Create New' button", target: "#create-new" },
          { instruction: "Select a template from the list", target: "#template-list" },
          { instruction: "Fill in the required fields", target: "#form-fields" },
          { instruction: "Click 'Save' to complete", target: "#save-button" },
        ],
        onNext: () => handleNext(),
        onBack: () => handleBack(),
      },
    },
    {
      id: "completion",
      component: CompletionScreen,
      props: {
        title: "You're All Set!",
        description: "You've completed the onboarding process and are ready to start using the application",
        onFinish: () => {
          completeOnboarding()
          router.push("/dashboard")
          toast({
            title: "Onboarding Completed",
            description: "You can access this tutorial again from your profile settings.",
          })
        },
        onBack: () => handleBack(),
      },
    },
  ]

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1)
      setStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    completeOnboarding()
    router.push("/dashboard")
    toast({
      title: "Onboarding Skipped",
      description: "You can access the tutorial anytime from your profile settings.",
    })
  }

  // Get the current step component
  const CurrentStepComponent = steps[currentStep].component
  const currentStepProps = steps[currentStep].props

  // Animation variants for slide transitions
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative mx-auto w-full max-w-4xl rounded-xl border bg-card p-6 shadow-lg md:p-8">
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

        <div className="relative mt-6 overflow-hidden rounded-lg">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={steps[currentStep].id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="min-h-[400px] w-full"
            >
              <CurrentStepComponent {...currentStepProps} />
            </motion.div>
          </AnimatePresence>
        </div>

        <OnboardingNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
          isLastStep={currentStep === totalSteps - 1}
        />
      </div>
    </div>
  )
}

