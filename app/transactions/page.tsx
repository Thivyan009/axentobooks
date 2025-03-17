import { Suspense } from "react"
import { getTransactions } from "@/lib/actions/transactions"
import { TransactionsContent } from "@/components/transactions/transactions-content"
import { TransactionsLoading } from "@/components/transactions/transactions-loading"

export default async function TransactionsPage() {
  const { transactions, error } = await getTransactions()

  return (
    <Suspense fallback={<TransactionsLoading />}>
      <TransactionsContent initialTransactions={transactions} error={error} />
    </Suspense>
  )
}

