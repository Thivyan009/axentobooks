import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const transactions = [
  {
    name: "Laptop",
    type: "expense",
    account: "cash",
    amount: "$316.00",
  },
  {
    name: "Than Payment",
    type: "income",
    account: "petty",
    amount: "$242.00",
  },
  {
    name: "Jey Income",
    type: "income",
    account: "cash",
    amount: "$837.00",
  },
  {
    name: "Lunch",
    type: "expense",
    account: "cash",
    amount: "$721.00",
  },
]

export function TransactionList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Manage your payments.</CardDescription>
          </div>
          <Button variant="outline">See All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 text-sm text-muted-foreground">
            <div>Name</div>
            <div>Type</div>
            <div>Account</div>
            <div className="text-right">Amount</div>
          </div>
          {transactions.map((transaction) => (
            <div key={transaction.name} className="grid grid-cols-4 items-center gap-4 rounded-lg py-2">
              <div className="flex items-center gap-2">
                <Checkbox />
                <span>{transaction.name}</span>
              </div>
              <div>{transaction.type}</div>
              <div>{transaction.account}</div>
              <div className="text-right font-medium">{transaction.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

