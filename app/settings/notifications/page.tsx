import type { Metadata } from "next"
import { SettingsHeader } from "@/components/settings/settings-header"
import { NotificationsForm } from "@/components/settings/notifications-form"

export const metadata: Metadata = {
  title: "Notification Settings - Axento Books",
  description: "Manage your notification preferences",
}

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <SettingsHeader title="Notifications" description="Configure how you receive notifications." />
      <NotificationsForm />
    </div>
  )
}

