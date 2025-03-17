import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function ForceOnboardingDirect() {
  // Force reset the cookie
  cookies().set("onboarding_complete", "false", { path: "/" })

  // Redirect directly to the onboarding controller
  redirect("/onboarding/controller")
}

