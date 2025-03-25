import { PageLayout } from "@/components/layouts/page-layout"
import type { ReactNode } from "react"

interface SettingsLayoutProps {
  children: ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <PageLayout>
      <div className="container mx-auto max-w-5xl p-6">
        {children}
      </div>
    </PageLayout>
  )
}

