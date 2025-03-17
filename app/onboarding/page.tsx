"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OnboardingPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Welcome to Axento Books!</CardTitle>
          <CardDescription>Let's set up your business profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Quick Setup Guide</h2>
            <ul className="list-inside list-decimal space-y-2">
              <li>Set up your business profile</li>
              <li>Configure your accounting preferences</li>
              <li>Add your team members</li>
              <li>Set up your first financial goals</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Skip for now
            </Button>
            <Button
              onClick={() => router.push("/onboarding/business-profile")}
            >
              Start Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

