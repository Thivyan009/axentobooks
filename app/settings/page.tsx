import { Suspense } from "react"
import { SettingsContent } from "@/components/settings/settings-content"
import { SettingsLoading } from "@/components/settings/settings-loading"

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  )
}

