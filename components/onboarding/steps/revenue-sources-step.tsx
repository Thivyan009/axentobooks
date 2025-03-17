"use client"

import { useState } from "react"
import { AlertCircle, DollarSign, Info, Plus, ShoppingBag, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import type { RevenueSource } from "@/lib/types/onboarding"

const REVENUE_CATEGORIES = [
  { value: "product_sales", label: "Product Sales" },
  { value: "services", label: "Services" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "consulting", label: "Consulting" },
  { value: "commissions", label: "Commissions" },
  { value: "rental_income", label: "Rental Income" },
  { value: "licensing", label: "Licensing/Royalties" },
  { value: "advertising", label: "Advertising" },
  { value: "other", label: "Other" },
]

interface RevenueSourcesStepProps {
  form: {
    getValues: () => any
    setValue: (field: string, value: any) => void
  }
  onNext: () => void
  onBack: () => void
  formData?: any
  updateFormData?: (field: string, data: any) => void
}

export function RevenueSourcesStep({ form, onNext, onBack, formData, updateFormData }: RevenueSourcesStepProps) {
  const [revenueSources, setRevenueSources] = useState<RevenueSource[]>(form.getValues().revenueSources || [])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { toast } = useToast()

  const validateRevenueSource = (source: RevenueSource, index: number) => {
    const newErrors: { [key: string]: string } = {}

    if (!source.name) {
      newErrors[`name-${index}`] = "Please enter a name"
    }
    if (!source.category) {
      newErrors[`category-${index}`] = "Please select a category"
    }
    if (!source.estimatedMonthly || source.estimatedMonthly <= 0) {
      newErrors[`estimatedMonthly-${index}`] = "Please enter an amount greater than 0"
    }

    return newErrors
  }

  const addRevenueSource = () => {
    const newSource = {
      name: "",
      description: "",
      estimatedMonthly: 0,
      category: "",
    }
    setRevenueSources([...revenueSources, newSource])
    toast({
      title: "Revenue Source Added",
      description: "Now fill in the details about this revenue source.",
    })
  }

  const removeRevenueSource = (index: number) => {
    const updatedSources = revenueSources.filter((_, i) => i !== index)
    setRevenueSources(updatedSources)
    form.setValue("revenueSources", updatedSources)
    if (updateFormData) {
      updateFormData("revenueSources", updatedSources)
    }

    // Clear errors for removed source
    const newErrors = { ...errors }
    delete newErrors[`name-${index}`]
    delete newErrors[`category-${index}`]
    delete newErrors[`estimatedMonthly-${index}`]
    setErrors(newErrors)

    toast({
      title: "Revenue Source Removed",
      description: "The revenue source has been removed from your list.",
    })
  }

  const updateRevenueSource = (index: number, field: keyof RevenueSource, value: any) => {
    const updatedSources = revenueSources.map((source, i) => {
      if (i === index) {
        const updatedSource = { ...source, [field]: value }
        const validationErrors = validateRevenueSource(updatedSource, index)
        setErrors((prev) => ({ ...prev, ...validationErrors }))
        return updatedSource
      }
      return source
    })
    setRevenueSources(updatedSources)
    form.setValue("revenueSources", updatedSources)
    if (updateFormData) {
      updateFormData("revenueSources", updatedSources)
    }
  }

  const handleNext = () => {
    let hasErrors = false
    const allErrors: { [key: string]: string } = {}

    revenueSources.forEach((source, index) => {
      const sourceErrors = validateRevenueSource(source, index)
      if (Object.keys(sourceErrors).length > 0) {
        hasErrors = true
        Object.assign(allErrors, sourceErrors)
      }
    })

    if (hasErrors) {
      setErrors(allErrors)
      toast({
        title: "Please check your information",
        description: "Some revenue sources need more details before you can continue.",
        variant: "destructive",
      })
      return
    }

    form.setValue("revenueSources", revenueSources)
    if (updateFormData) {
      updateFormData("revenueSources", revenueSources)
    }
    onNext()
  }

  // Calculate total monthly revenue
  const totalMonthlyRevenue = revenueSources.reduce((sum, source) => sum + (source.estimatedMonthly || 0), 0)

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold">How does your business make money?</h2>
        <p className="text-muted-foreground">Tell us about your different revenue streams and income sources</p>
      </div>

      <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg text-green-700 dark:text-green-300">
            <Info className="h-5 w-5" />
            Understanding Revenue Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-700 dark:text-green-300">
          <p>
            Revenue sources are the different ways your business makes money. Tracking them separately helps you
            understand which parts of your business are most profitable and where to focus your efforts.
          </p>
          <p className="mt-2">
            Examples include product sales, service fees, subscriptions, or any other way customers pay you.
          </p>
        </CardContent>
      </Card>

      {revenueSources.length > 0 && (
        <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-700 dark:text-green-300">Total Monthly Revenue</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">
              ${totalMonthlyRevenue.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {revenueSources.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No revenue sources added yet</AlertTitle>
          <AlertDescription>
            Click the "Add Revenue Source" button below to start adding ways your business makes money.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {revenueSources.map((source, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Revenue Source {index + 1}
              </CardTitle>
              <CardDescription>Tell us how your business makes money</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="text-sm font-medium flex items-center gap-1">
                        Name
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>What do you call this revenue source?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Input
                  placeholder="E.g., Online Store Sales, Consulting Services"
                  value={source.name}
                  onChange={(e) => updateRevenueSource(index, "name", e.target.value)}
                  className={errors[`name-${index}`] ? "border-destructive" : ""}
                />
                {errors[`name-${index}`] && <p className="text-sm text-destructive">{errors[`name-${index}`]}</p>}
              </div>

              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="text-sm font-medium flex items-center gap-1">
                        Category
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>What type of revenue is this?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Select
                  value={source.category}
                  onValueChange={(value) => updateRevenueSource(index, "category", value)}
                >
                  <SelectTrigger className={errors[`category-${index}`] ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVENUE_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`category-${index}`] && (
                  <p className="text-sm text-destructive">{errors[`category-${index}`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="text-sm font-medium flex items-center gap-1">
                        Description (Optional)
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Provide more details about this revenue source</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Textarea
                  placeholder="E.g., Sales from our e-commerce website"
                  value={source.description}
                  onChange={(e) => updateRevenueSource(index, "description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="text-sm font-medium flex items-center gap-1">
                        Estimated Monthly Amount
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>How much do you typically earn from this source each month?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={source.estimatedMonthly || ""}
                    onChange={(e) =>
                      updateRevenueSource(index, "estimatedMonthly", Number.parseFloat(e.target.value) || 0)
                    }
                    className={`pl-6 ${errors[`estimatedMonthly-${index}`] ? "border-destructive" : ""}`}
                  />
                </div>
                {errors[`estimatedMonthly-${index}`] && (
                  <p className="text-sm text-destructive">{errors[`estimatedMonthly-${index}`]}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeRevenueSource(index)}>
                <Trash className="mr-2 h-4 w-4" />
                Remove Revenue Source
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={addRevenueSource}>
          <Plus className="mr-2 h-4 w-4" />
          Add Revenue Source
        </Button>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleNext}>{revenueSources.length === 0 ? "Skip for now" : "Continue"}</Button>
        </div>
      </div>
    </div>
  )
}

