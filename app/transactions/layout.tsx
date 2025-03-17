import type { ReactNode } from "react"
import { PageLayout } from "@/components/layouts/page-layout"

interface TransactionsLayoutProps {
  children: ReactNode
}

export default function TransactionsLayout({ children }: TransactionsLayoutProps) {
  return (
    <PageLayout title="Transactions" description="Manage your transactions and cash flow">
      {children}
    </PageLayout>
  )
}

