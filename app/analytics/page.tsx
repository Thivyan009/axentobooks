import { Suspense } from "react"
import { PageLayout } from "@/components/layouts/page-layout"
import { AnalyticsContent } from "@/components/analytics/analytics-content"
import { AnalyticsLoading } from "@/components/analytics/analytics-loading"

export default function AnalyticsPage() {
  return (
    <PageLayout title="Analytics" description="Track your financial metrics and insights">
      <Suspense fallback={<AnalyticsLoading />}>
        <AnalyticsContent />
      </Suspense>
    </PageLayout>
  )
}

