import { cookies } from "next/headers"
import Link from "next/link"

export default function DebugPage() {
  // Get all cookies
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()

  // Check onboarding cookie specifically
  const onboardingCookie = cookieStore.get("onboarding_complete")

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">Debug Information</h1>

      <div className="mb-8 rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-semibold">Onboarding Status</h2>
        <p className="mb-2">
          <strong>Onboarding Cookie:</strong> {onboardingCookie ? `"${onboardingCookie.value}"` : "Not set"}
        </p>
        <p>
          <strong>Should Show Onboarding:</strong>{" "}
          {!onboardingCookie || onboardingCookie.value !== "true" ? "Yes" : "No"}
        </p>
      </div>

      <div className="mb-8 rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-semibold">All Cookies</h2>
        <pre className="whitespace-pre-wrap rounded bg-muted p-4">{JSON.stringify(allCookies, null, 2)}</pre>
      </div>

      <div className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/force-onboarding-direct"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Force Onboarding (Direct)
          </Link>
          <Link
            href="/reset"
            className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
          >
            Reset Onboarding
          </Link>
          <Link href="/" className="rounded-md border px-4 py-2 hover:bg-muted">
            Go to Home
          </Link>
          <Link href="/dashboard" className="rounded-md border px-4 py-2 hover:bg-muted">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

