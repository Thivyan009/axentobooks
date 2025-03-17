import type { Metadata } from "next"
import { SettingsHeader } from "@/components/settings/settings-header"
import { CurrencyForm } from "@/components/settings/currency-form"

export const metadata: Metadata = {
  title: "Currency Settings - Axento Books",
  description: "Manage your currency preferences",
}

export default function CurrencyPage() {
  return (
    <div className="space-y-6">
      <SettingsHeader title="Currency" description="Configure your preferred currency." />
      <CurrencyForm />
    </div>
  )
}

