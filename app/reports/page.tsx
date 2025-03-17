import { Suspense } from "react"
import { PageLayout } from "@/components/layouts/page-layout"
import { ReportsContent } from "./reports-content"
import { ReportsLoading } from "@/components/reports/reports-loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  return (
    <PageLayout title="Reports" description="View and manage your financial reports">
      <Tabs defaultValue="generated" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generated">
          <Suspense fallback={<ReportsLoading />}>
            <ReportsContent />
          </Suspense>
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}

