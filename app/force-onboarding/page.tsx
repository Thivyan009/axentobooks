import { resetAndRedirectAction } from "@/lib/actions/onboarding"

export default function ForceOnboarding() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Redirecting to Onboarding...</h1>
      <p className="mb-8 text-muted-foreground">You'll be redirected to the onboarding flow in a moment.</p>
      <form action={resetAndRedirectAction}>
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          Go to Onboarding
        </button>
      </form>
    </div>
  )
}

