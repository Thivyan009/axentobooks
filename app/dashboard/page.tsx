import { PageLayout } from "@/components/layouts/page-layout"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default function DashboardPage() {
  return (
    <PageLayout title="Dashboard" description="Welcome back to Axento Books">
      <DashboardContent />
    </PageLayout>
  )
}

