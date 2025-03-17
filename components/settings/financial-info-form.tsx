"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { AssetsStep } from "@/components/onboarding/steps/assets-step"
import { LiabilitiesStep } from "@/components/onboarding/steps/liabilities-step"
import { EquityStep } from "@/components/onboarding/steps/equity-step"
import { saveFinancialInfoAction } from "@/lib/actions/financial-info"
import type { Asset, Liability, Equity } from "@/lib/types/onboarding"

export function FinancialInfoForm() {
  const [activeTab, setActiveTab] = useState("assets")
  const [isLoading, setIsLoading] = useState(false)
  const [financialData, setFinancialData] = useState({
    assets: [] as Asset[],
    liabilities: [] as Liability[],
    equity: [] as Equity[],
  })
  const { toast } = useToast()

  // In a real app, you would fetch the user's existing financial data
  useEffect(() => {
    // Simulate loading existing data
    const loadData = async () => {
      // This would be a real API call in production
      // For now, we'll use mock data or localStorage if available
      const savedData = localStorage.getItem("financialData")
      if (savedData) {
        try {
          setFinancialData(JSON.parse(savedData))
        } catch (e) {
          console.error("Failed to parse saved financial data", e)
        }
      }
    }

    loadData()
  }, [])

  // Create a form object to pass to components
  const form = {
    getValues: () => financialData,
    setValue: (field: string, value: any) => {
      setFinancialData((prev) => ({
        ...prev,
        [field]: value,
      }))
    },
  }

  const updateFormData = (field: keyof typeof financialData, data: any) => {
    setFinancialData({
      ...financialData,
      [field]: data,
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Save to localStorage for demo purposes
      localStorage.setItem("financialData", JSON.stringify(financialData))

      // In a real app, you would save to your backend
      await saveFinancialInfoAction(financialData)

      toast({
        title: "Financial information updated",
        description: "Your financial details have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "There was an error saving your financial information.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Dummy functions for the step components
  const dummyFunction = () => {}

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Financial Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your business assets, liabilities, and equity information.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
          <TabsTrigger value="equity">Equity</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
              <CardDescription>Update what your business owns - cash, property, equipment, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <AssetsStep
                form={form}
                onNext={dummyFunction}
                onBack={dummyFunction}
                formData={financialData}
                updateFormData={updateFormData}
                isSettings={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liabilities" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Liabilities</CardTitle>
              <CardDescription>Update what your business owes - loans, credit cards, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <LiabilitiesStep
                form={form}
                onNext={dummyFunction}
                onBack={dummyFunction}
                formData={financialData}
                updateFormData={updateFormData}
                isSettings={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Equity</CardTitle>
              <CardDescription>Update your business equity - investments, retained earnings, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <EquityStep
                form={form}
                onNext={dummyFunction}
                onBack={dummyFunction}
                formData={financialData}
                updateFormData={updateFormData}
                isSettings={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}

