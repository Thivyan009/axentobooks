import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditForm } from "@/components/transactions/edit-form"
import { getTransactionById } from "@/lib/actions/transactions"

interface EditTransactionPageProps {
  params: {
    id: string
  }
}

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const result = await getTransactionById(params.id)

  if (!result.transaction) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <EditForm transaction={result.transaction} />
        </CardContent>
      </Card>
    </div>
  )
} 