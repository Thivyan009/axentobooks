import { PageLayout } from "@/components/layouts/page-layout"
import { CustomReportBuilder } from "@/components/reports/custom-report-builder"
import { Suspense } from "react"

export default function CustomReportPage() {
  return (
    <PageLayout title="Custom Reports" description="Build and generate custom financial reports">
      <Suspense fallback={<div>Loading...</div>}>
        <CustomReportBuilder />
      </Suspense>
    </PageLayout>
  )
}

