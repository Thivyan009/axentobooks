import { PageLayout } from "@/components/layouts/page-layout"
import { CustomReportBuilder } from "@/components/reports/custom-report-builder"

export default function CustomReportPage() {
  return (
    <PageLayout title="Custom Reports" description="Build and generate custom financial reports">
      <CustomReportBuilder />
    </PageLayout>
  )
}

