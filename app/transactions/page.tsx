import { Suspense } from "react"
import { PageLayout } from "@/components/layouts/page-layout"
import { TransactionsContent } from "@/components/transactions/transactions-content"
import { TransactionsLoading } from "@/components/transactions/transactions-loading"

export default function TransactionsPage() {
  return (
    <PageLayout title="Transactions" description="Manage and track your financial transactions">
      <Suspense fallback={<TransactionsLoading />}>
        <TransactionsContent />
      </Suspense>
    </PageLayout>
  )
}

