"use client"

import { useState } from "react"
import { AlertCircle, CreditCard, DollarSign, Info, Plus, Trash, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import type { Equity } from "@/lib/types/onboarding"

const EQUITY_TYPES = [
  {
    value: "OWNER_EQUITY",
    label: "Owner Investment",
    icon: DollarSign,
    description: "Money you've personally invested in the business",
    example: "Initial Investment: $10,000",
  },
  {
    value: "RETAINED_EARNINGS",
    label: "Retained Earnings",
    icon: TrendingUp,
    description: "Profits that have been reinvested in the business",
    example: "Retained Profits: $25,000",
  },
  {
    value: "other_equity",
    label: "Other Equity",
    icon: CreditCard,
    description: "Other sources of business ownership or capital",
    example: "Partner Investment: $15,000",
  },
] as const

interface EquityStepProps {
  form: {
    getValues: () => { equity?: Equity[] }
    setValue: (field: string, value: Equity[]) => void
  }
  onNext: () => void
  onBack: () => void
  formData?: { equity?: Equity[] }
  updateFormData?: (field: string, data: Equity[]) => void
  isSettings?: boolean
}

export function EquityStep({ form, onNext, onBack, formData, updateFormData, isSettings = false }: EquityStepProps) {
  const [equity, setEquity] = useState<Equity[]>(form.getValues().equity || [])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { toast } = useToast()

  const validateEquity = (equityItem: Equity, index: number) => {
    const newErrors: { [key: string]: string } = {}

    if (!equityItem.type) {
      newErrors[`type-${index}`] = "Please select a type"
    }
    if (!equityItem.description) {
      newErrors[`description-${index}`] = "Please add a short description"
    }
    if (!equityItem.amount || equityItem.amount <= 0) {
      newErrors[`amount-${index}`] = "Please enter an amount greater than 0"
    }

    return newErrors
  }

  const addEquity = () => {
    const newEquity: Equity = {
      type: "OWNER_EQUITY",
      description: "",
      amount: 0,
    }
    setEquity([...equity, newEquity])
    toast({
      title: "Item Added",
      description: "Now fill in the details about your business equity.",
    })
  }

  const removeEquity = (index: number) => {
    const updatedEquity = equity.filter((_, i) => i !== index)
    setEquity(updatedEquity)
    form.setValue("equity", updatedEquity)
    if (updateFormData) {
      updateFormData("equity", updatedEquity)
    }

    // Clear errors for removed equity
    const newErrors = { ...errors }
    delete newErrors[`type-${index}`]
    delete newErrors[`description-${index}`]
    delete newErrors[`amount-${index}`]
    setErrors(newErrors)

    toast({
      title: "Item Removed",
      description: "The item has been removed from your list.",
    })
  }

  const updateEquityItem = (index: number, field: keyof Equity, value: string | number) => {
    const updatedEquity = equity.map((item, i) => {
      if (i === index) {
        // If updating the type field, ensure it's a valid type
        if (field === "type" && typeof value === "string") {
          const updatedItem = {
            ...item,
            [field]: value as "OWNER_EQUITY" | "RETAINED_EARNINGS"
          }
          const validationErrors = validateEquity(updatedItem, index)
          setErrors((prev) => ({ ...prev, ...validationErrors }))
          return updatedItem
        }
        // For other fields, update as normal
        const updatedItem = { ...item, [field]: value }
        const validationErrors = validateEquity(updatedItem, index)
        setErrors((prev) => ({ ...prev, ...validationErrors }))
        return updatedItem
      }
      return item
    })
    setEquity(updatedEquity)
    form.setValue("equity", updatedEquity)
    if (updateFormData) {
      updateFormData("equity", updatedEquity)
    }
  }

  const handleNext = () => {
    let hasErrors = false
    const allErrors: { [key: string]: string } = {}

    equity.forEach((item, index) => {
      const equityErrors = validateEquity(item, index)
      if (Object.keys(equityErrors).length > 0) {
        hasErrors = true
        Object.assign(allErrors, equityErrors)
      }
    })

    if (hasErrors) {
      setErrors(allErrors)
      toast({
        title: "Please check your information",
        description: "Some items need more details before you can continue.",
        variant: "destructive",
      })
      return
    }

    form.setValue("equity", equity)
    if (updateFormData) {
      updateFormData("equity", equity)
    }
    onNext()
  }

  const getSelectedEquityType = (value: string) => {
    return EQUITY_TYPES.find((type) => type.value === value)
  }

  // Calculate total equity value
  const totalEquityValue = equity.reduce((sum, item) => sum + (item.amount || 0), 0)

  // Helper function to render equity type icon
  const renderEquityIcon = (type: string) => {
    const selectedType = EQUITY_TYPES.find((t) => t.value === type)
    if (selectedType) {
      const IconComponent = selectedType.icon
      return <IconComponent className="h-5 w-5 text-primary" />
    }
    return null
  }

  return (
    <div className={`space-y-6 ${isSettings ? "" : "max-w-3xl mx-auto"}`}>
      {!isSettings && (
        <div>
          <h2 className="text-2xl font-bold">What is your business equity?</h2>
          <p className="text-muted-foreground">
            Equity represents the value that would be returned to the business owners after all liabilities are paid off
          </p>
        </div>
      )}

      {!isSettings && (
        <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-purple-700 dark:text-purple-300">
              <Info className="h-5 w-5" />
              Understanding Equity
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-purple-700 dark:text-purple-300">
            <p>
              Equity is the ownership interest in your business. It represents what would be left if you sold all assets
              and paid off all debts.
            </p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/50 dark:bg-purple-900/30 p-3">
                <h4 className="font-medium">Examples include:</h4>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Money you've invested in the business</li>
                  <li>Profits that have been reinvested</li>
                  <li>Investments from partners or shareholders</li>
                </ul>
              </div>
              <div className="rounded-lg bg-white/50 dark:bg-purple-900/30 p-3">
                <h4 className="font-medium">Tips:</h4>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Include all money you've put into the business</li>
                  <li>For new businesses, equity often equals initial investment</li>
                  <li>For established businesses, include retained earnings</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {equity.length > 0 && (
        <div className="rounded-lg border bg-purple-50 p-4 dark:bg-purple-950/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-purple-700 dark:text-purple-300">Total Equity</span>
            </div>
            <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
              ${totalEquityValue.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {equity.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No equity added yet</AlertTitle>
          <AlertDescription>
            Click the "Add Item" button below to start adding your business equity. This includes money you've invested
            in the business and any retained earnings.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {equity.map((item, index) => {
          const typeId = `equity-type-${index}`
          const descriptionId = `equity-description-${index}`
          const amountId = `equity-amount-${index}`

          return (
            <Card key={`${item.type}-${index}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {item.type && renderEquityIcon(item.type)}
                  Item {index + 1}
                </CardTitle>
                <CardDescription>Tell us about your business equity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label htmlFor={typeId} className="text-sm font-medium flex items-center gap-1">
                          What type of equity is this?
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </label>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Select the category that best describes this equity</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Select
                    value={item.type}
                    onValueChange={(value) => updateEquityItem(index, "type", value)}
                  >
                    <SelectTrigger
                      id={typeId}
                      className={errors[`type-${index}`] ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EQUITY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[`type-${index}`] && (
                    <p className="text-sm text-destructive">{errors[`type-${index}`]}</p>
                  )}
                  {item.type && (
                    <p className="text-sm text-muted-foreground">
                      {EQUITY_TYPES.find(t => t.value === item.type)?.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label htmlFor={descriptionId} className="text-sm font-medium flex items-center gap-1">
                          Description
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </label>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Briefly describe this equity (e.g., "Initial Investment", "Retained Earnings")</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    id={descriptionId}
                    placeholder={
                      item.type ? EQUITY_TYPES.find(t => t.value === item.type)?.example.split(":")[0] : "E.g., Initial Investment"
                    }
                    value={item.description}
                    onChange={(e) => updateEquityItem(index, "description", e.target.value)}
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
                        <label htmlFor={amountId} className="text-sm font-medium flex items-center gap-1">
                          What is the amount?
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </label>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Enter the amount of this equity in dollars</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id={amountId}
                      type="number"
                      placeholder="0.00"
                      value={item.amount || ""}
                      onChange={(e) => updateEquityItem(index, "amount", Number(e.target.value) || 0)}
                      className={`pl-6 ${errors[`amount-${index}`] ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors[`amount-${index}`] && (
                    <p className="text-sm text-destructive">{errors[`amount-${index}`]}</p>
                  )}
                  {item.type && (
                    <p className="text-sm text-muted-foreground">
                      Example: {EQUITY_TYPES.find(t => t.value === item.type)?.example.split(": ")[1]}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeEquity(index)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Remove Item
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={addEquity}>
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

