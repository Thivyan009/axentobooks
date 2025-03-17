import { resetOnboardingAction } from "@/lib/actions/onboarding"

export default function RestartOnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form action={resetOnboardingAction}>
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-white">
          Reset and Start Onboarding
        </button>
      </form>
    </div>
  )
}

