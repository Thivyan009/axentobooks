import { Breadcrumb } from "@/components/ui/breadcrumb"
import { SettingsMobileNav } from "@/components/settings/settings-mobile-nav"

interface SettingsHeaderProps {
  title: string
  description?: string
}

export function SettingsHeader({ title, description }: SettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-4">
          <SettingsMobileNav />
          <Breadcrumb
            segments={[{ title: "Dashboard", href: "/dashboard" }, { title: "Settings", href: "/settings" }, { title }]}
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

