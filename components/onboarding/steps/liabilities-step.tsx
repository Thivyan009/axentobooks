"use client"

import { useState } from "react"
import { AlertCircle, Building, CreditCard, Home, Info, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { notify } from "@/lib/notifications"
import type { Liability } from "@/lib/types/onboarding"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"

const LIABILITY_TYPES = [
  {
    value: "credit_cards",
    label: "Credit Cards",
    icon: CreditCard,
    description: "Business credit card balances that need to be paid",
    example: "Business Credit Card: $2,500",
  },
  {
    value: "loans",
    label: "Business Loans",
    icon: Building,
    description: "Bank loans, lines of credit, or other business financing",
    example: "Bank Loan: $50,000",
  },
  {
    value: "mortgage",
    label: "Mortgage or Rent",
    icon: Home,
    description: "Loans for business property or upcoming rent payments",
    example: "Office Mortgage: $150,000",
  },
  {
    value: "other",
    label: "Other Debts",
    icon: AlertCircle,
    description: "Any other money your business owes to others",
    example: "Supplier Invoice: $1,200",
  },
]

interface LiabilitiesStepProps {
  form: {
    getValues: () => any
    setValue: (field: string, value: any) => void
  }
  onNext: () => void
  onBack: () => void
  formData?: any
  updateFormData?: (field: string, data: any) => void
  isSettings?: boolean
}

export function LiabilitiesStep({
  form,
  onNext,
  onBack,
  formData,
  updateFormData,
  isSettings = false,
}: LiabilitiesStepProps) {
  const [liabilities, setLiabilities] = useState<Liability[]>(form.getValues().liabilities || [])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { selectedCurrency } = useCurrencyStore()

  const validateLiability = (liability: Liability, index: number) => {
    const newErrors: { [key: string]: string } = {}

    if (!liability.type) {
      newErrors[`type-${index}`] = "Please select a type"
    }
    if (!liability.description) {
      newErrors[`description-${index}`] = "Please add a short description"
    }
    if (!liability.amount || liability.amount <= 0) {
      newErrors[`amount-${index}`] = "Please enter an amount greater than 0"
    }

    return newErrors
  }

  const addLiability = () => {
    const newLiability: Liability = {
      type: "",
      name: "",
      description: "",
      amount: 0,
    }
    setLiabilities([...liabilities, newLiability])
    notify.success("Item added")
  }

  const removeLiability = (index: number) => {
    const updatedLiabilities = liabilities.filter((_, i) => i !== index)
    setLiabilities(updatedLiabilities)
    form.setValue("liabilities", updatedLiabilities)
    if (updateFormData) {
      updateFormData("liabilities", updatedLiabilities)
    }

    // Clear errors for removed liability
    const newErrors = { ...errors }
    delete newErrors[`type-${index}`]
    delete newErrors[`description-${index}`]
    delete newErrors[`amount-${index}`]
    setErrors(newErrors)

    notify.success("Item removed")
  }

  const updateLiability = (index: number, field: keyof Liability, value: any) => {
    const updatedLiabilities = liabilities.map((liability, i) => {
      if (i === index) {
        const updatedLiability = { ...liability, [field]: value }
        // Set the name field to be the same as description
        if (field === "description") {
          updatedLiability.name = value
        }
        const validationErrors = validateLiability(updatedLiability, index)
        setErrors((prev) => ({ ...prev, ...validationErrors }))
        return updatedLiability
      }
      return liability
    })
    setLiabilities(updatedLiabilities)
    form.setValue("liabilities", updatedLiabilities)
    if (updateFormData) {
      updateFormData("liabilities", updatedLiabilities)
    }
  }

  const handleNext = () => {
    let hasErrors = false
    const allErrors: { [key: string]: string } = {}

    liabilities.forEach((liability, index) => {
      const liabilityErrors = validateLiability(liability, index)
      if (Object.keys(liabilityErrors).length > 0) {
        hasErrors = true
        Object.assign(allErrors, liabilityErrors)
      }
    })

    if (hasErrors) {
      setErrors(allErrors)
      notify.error("Please check your information")
      return
    }

    // Ensure all liabilities have the name field set
    const finalLiabilities = liabilities.map(liability => ({
      ...liability,
      name: liability.description // Set name to be the same as description
    }))

    form.setValue("liabilities", finalLiabilities)
    if (updateFormData) {
      updateFormData("liabilities", finalLiabilities)
    }
    onNext()
  }

  // Helper function to render liability type icon
  const renderLiabilityIcon = (type: string) => {
    const selectedType = LIABILITY_TYPES.find((t) => t.value === type)
    if (selectedType) {
      const IconComponent = selectedType.icon
      return <IconComponent className="h-5 w-5 text-primary" />
    }
    return null
  }

  const getSelectedLiabilityType = (value: string) => {
    return LIABILITY_TYPES.find((type) => type.value === value)
  }

  // Calculate total liabilities amount
  const totalLiabilitiesAmount = liabilities.reduce((sum, liability) => sum + (liability.amount || 0), 0)

  return (
    <div className={`space-y-6 ${isSettings ? "" : "max-w-3xl mx-auto"}`}>
      {!isSettings && (
        <div>
          <h2 className="text-2xl font-bold">What does your business owe?</h2>
          <p className="text-muted-foreground">
            These are debts or financial obligations your business needs to pay - we call these "liabilities"
          </p>
        </div>
      )}

      {!isSettings && (
        <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-red-700 dark:text-red-300">
              <Info className="h-5 w-5" />
              Understanding Liabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-red-700 dark:text-red-300">
            <p>
              Liabilities are debts or financial obligations that your business owes to others. These represent money
              that will need to be paid in the future.
            </p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/50 dark:bg-red-900/30 p-3">
                <h4 className="font-medium">Examples include:</h4>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Business loans</li>
                  <li>Credit card balances</li>
                  <li>Unpaid bills to suppliers</li>
                  <li>Mortgages on business property</li>
                </ul>
              </div>
              <div className="rounded-lg bg-white/50 dark:bg-red-900/30 p-3">
                <h4 className="font-medium">Tips:</h4>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Only include business debts, not personal ones</li>
                  <li>For credit cards, include the current balance</li>
                  <li>It's okay if you don't have any liabilities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {liabilities.length > 0 && (
        <div className="rounded-lg border bg-red-50 p-4 dark:bg-red-950/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="font-medium text-red-700 dark:text-red-300">Total Liabilities</span>
            </div>
            <div className="text-xl font-bold text-red-700 dark:text-red-300">
              {formatCurrency(totalLiabilitiesAmount, selectedCurrency.code)}
            </div>
          </div>
        </div>
      )}

      {liabilities.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No liabilities added yet</AlertTitle>
          <AlertDescription>
            Click the "Add Item" button below to start adding what your business owes. If your business doesn't owe
            anything, you can click "Continue" to move to the next step.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {liabilities.map((liability, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {liability.type && renderLiabilityIcon(liability.type)}
                Item {index + 1}
              </CardTitle>
              <CardDescription>Tell us about something your business owes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="text-sm font-medium flex items-center gap-1">
                        What type of debt is this?
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Select the category that best describes this debt</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Select value={liability.type} onValueChange={(value) => updateLiability(index, "type", value)}>
                  <SelectTrigger className={errors[`type-${index}`] ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIABILITY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`type-${index}`] && <p className="text-sm text-destructive">{errors[`type-${index}`]}</p>}
                {liability.type && (
                  <p className="text-sm text-muted-foreground">
                    {getSelectedLiabilityType(liability.type)?.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="text-sm font-medium flex items-center gap-1">
                        Description
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Briefly describe this debt (e.g., "Bank Loan", "Business Credit Card")</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Input
                  placeholder={
                    liability.type
                      ? getSelectedLiabilityType(liability.type)?.example.split(":")[0]
                      : "E.g., Business Loan"
                  }
                  value={liability.description}
                  onChange={(e) => updateLiability(index, "description", e.target.value)}
                  className={errors[`description-${index}`] ? "border-destructive" : ""}
                />
                {errors[`description-${index}`] && (
                  <p className="text-sm text-destructive">{errors[`description-${index}`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="text-sm font-medium flex items-center gap-1">
                        How much is owed?
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Enter the current balance of this debt in dollars</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{selectedCurrency.symbol}</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={liability.amount || ""}
                    onChange={(e) => updateLiability(index, "amount", Number.parseFloat(e.target.value) || 0)}
                    className={`pl-6 ${errors[`amount-${index}`] ? "border-destructive" : ""}`}
                  />
                </div>
                {errors[`amount-${index}`] && <p className="text-sm text-destructive">{errors[`amount-${index}`]}</p>}
                {liability.type && (
                  <p className="text-sm text-muted-foreground">
                    Example: {getSelectedLiabilityType(liability.type)?.example.split(": ")[1]}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeLiability(index)}>
                <Trash className="mr-2 h-4 w-4" />
                Remove Item
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={addLiability}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
        {!isSettings && (
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={handleNext}>Continue</Button>
          </div>
        )}
      </div>
    </div>
  )
}

