import { Suspense } from "react"
import { PageLayout } from "@/components/layouts/page-layout"
import { ReportsContent } from "./reports-content"
import { ReportsLoading } from "@/components/reports/reports-loading"

export default function ReportsPage() {
  return (
    <PageLayout title="Reports" description="View and manage your financial reports">
      <Suspense fallback={<ReportsLoading />}>
        <ReportsContent />
      </Suspense>
    </PageLayout>
  )
}

