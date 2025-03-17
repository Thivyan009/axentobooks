import type { Metadata } from "next"
import { SettingsHeader } from "@/components/settings/settings-header"
import { AppearanceForm } from "@/components/settings/appearance-form"

export const metadata: Metadata = {
  title: "Appearance Settings - Axento Books",
  description: "Customize the appearance of your dashboard",
}

export default function AppearancePage() {
  return (
    <div className="space-y-6">
      <SettingsHeader title="Appearance" description="Customize the look and feel of your dashboard." />
      <AppearanceForm />
    </div>
  )
}

