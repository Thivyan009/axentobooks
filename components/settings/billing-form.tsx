"use client"

import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export function BillingForm() {
  const { toast } = useToast()

  const handleUpgrade = () => {
    toast({
      title: "Coming soon",
      description: "This feature will be available soon.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>View your current plan and billing information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <h3 className="font-medium">Free Plan</h3>
              <p className="text-sm text-muted-foreground">Basic features for small businesses</p>
            </div>
            <Button disabled>Upgrade</Button>
          </div>
          <div className="rounded-lg border">
            <div className="p-6">
              <h3 className="font-medium">Payment Method</h3>
              <p className="mt-1 text-sm text-muted-foreground">Add a payment method to upgrade to a paid plan.</p>
              <div className="mt-4 flex items-center space-x-4">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">No payment method added</p>
                  <p className="text-sm text-muted-foreground">Add a card to enable automatic payments</p>
                </div>
                <Button variant="outline" disabled>Add Payment Method</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your billing history and download invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="p-6">
              <p className="text-sm text-muted-foreground">No billing history available.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

