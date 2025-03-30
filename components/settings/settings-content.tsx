"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppearanceForm } from "@/components/settings/appearance-form"
import { NotificationsForm } from "@/components/settings/notifications-form"
import { CurrencyForm } from "@/components/settings/currency-form"
import { AccountForm } from "@/components/settings/account-form"
import { BillingForm } from "@/components/settings/billing-form"
import { SecurityForm } from "@/components/settings/security-form"
import { FinancialInfo } from "@/components/settings/financial-info"

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("account")

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and set preferences.</p>
      </div>
      <Separator className="my-6" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="space-y-6">
          <AccountForm />
        </TabsContent>
        <TabsContent value="appearance" className="space-y-6">
          <AppearanceForm />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <NotificationsForm />
        </TabsContent>
        <TabsContent value="billing" className="space-y-6">
          <BillingForm />
        </TabsContent>
        <TabsContent value="security" className="space-y-6">
          <SecurityForm />
        </TabsContent>
        <TabsContent value="currency" className="space-y-6">
          <CurrencyForm />
        </TabsContent>
        <TabsContent value="financial" className="space-y-6">
          <FinancialInfo />
        </TabsContent>
      </Tabs>
    </div>
  )
}

