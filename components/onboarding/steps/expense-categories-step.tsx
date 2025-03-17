"use client"

import { useState } from "react"
import { AlertCircle, DollarSign, Info, Plus, Receipt, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { ExpenseCategory } from "@/lib/types/onboarding"

const EXPENSE_CATEGORIES = [
  { value: "rent", label: "Rent/Mortgage" },
  { value: "utilities", label: "Utilities" },
  { value: "payroll", label: "Payroll" },
  { value: "inventory", label: "Inventory/COGS" },
  { value: "marketing", label: "Marketing/Advertising" },
  { value: "insurance", label: "Insurance" },
  { value: "supplies", label: "Office Supplies" },
  { value: "software", label: "Software/Subscriptions" },
  { value: "travel", label: "Travel" },
  { value: "professional_services", label: "Professional Services" },
  { value: "taxes", label: "Taxes" },
  { value: "other", label: "Other" },
]

interface ExpenseCategoriesStepProps {
  form: {
    getValues: () => any
    setValue: (field: string, value: any) => void
  }
  onNext: () => void
  onBack: () => void
  formData?: any
  updateFormData?: (field: string, data: any) => void
}

export function ExpenseCategoriesStep({ form, onNext, onBack, formData, updateFormData }: ExpenseCategoriesStepProps) {
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    form.getValues().expenseCategories || [],
  )
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { toast } = useToast()

  const validateExpenseCategory = (category: ExpenseCategory, index: number) => {
    const newErrors: { [key: string]: string } = {}

    if (!category.name) {
      newErrors[`name-${index}`] = "Please enter a name"
    }
    if (!category.estimatedMonthly || category.estimatedMonthly <= 0) {
      newErrors[`estimatedMonthly-${index}`] = "Please enter an amount greater than 0"
    }

    return newErrors
  }

  const addExpenseCategory = () => {
    const newCategory = {
      name: "",
      description: "",
      estimatedMonthly: 0,
      isFixed: true,
    }
    setExpenseCategories([...expenseCategories, newCategory])
    toast({
      title: "Expense Category Added",
      description: "Now fill in the details about this expense category.",
    })
  }

  const removeExpenseCategory = (index: number) => {
    const updatedCategories = expenseCategories.filter((_, i) => i !== index)
    setExpenseCategories(updatedCategories)
    form.setValue("expenseCategories", updatedCategories)
    if (updateFormData) {
      updateFormData("expenseCategories", updatedCategories)
    }

    // Clear errors for removed category
    const newErrors = { ...errors }
    delete newErrors[`name-${index}`]
    delete newErrors[`estimatedMonthly-${index}`]
    setErrors(newErrors)

    toast({
      title: "Expense Category Removed",
      description: "The expense category has been removed from your list.",
    })
  }

  const updateExpenseCategory = (index: number, field: keyof ExpenseCategory, value: any) => {
    const updatedCategories = expenseCategories.map((category, i) => {
      if (i === index) {
        const updatedCategory = { ...category, [field]: value }
        const validationErrors = validateExpenseCategory(updatedCategory, index)
        setErrors((prev) => ({ ...prev, ...validationErrors }))
        return updatedCategory
      }
      return category
    })
    setExpenseCategories(updatedCategories)
    form.setValue("expenseCategories", updatedCategories)
    if (updateFormData) {
      updateFormData("expenseCategories", updatedCategories)
    }
  }

  const handleNext = () => {
    let hasErrors = false
    const allErrors: { [key: string]: string } = {}

    expenseCategories.forEach((category, index) => {
      const categoryErrors = validateExpenseCategory(category, index)
      if (Object.keys(categoryErrors).length > 0) {
        hasErrors = true
        Object.assign(allErrors, categoryErrors)
      }
    })

    if (hasErrors) {
      setErrors(allErrors)
      toast({
        title: "Please check your information",
        description: "Some expense categories need more details before you can continue.",
        variant: "destructive",
      })
      return
    }

    form.setValue("expenseCategories", expenseCategories)
    if (updateFormData) {
      updateFormData("expenseCategories", expenseCategories)
    }
    onNext()
  }

  // Calculate total monthly expenses
  const totalMonthlyExpenses = expenseCategories.reduce((sum, category) => sum + (category.estimatedMonthly || 0), 0)

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold">What are your business expenses?</h2>
        <p className="text-muted-foreground">Tell us about your regular business costs and spending categories</p>
      </div>

      <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg text-red-700 dark:text-red-300">
            <Info className="h-5 w-5" />
            Understanding Expense Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-red-700 dark:text-red-300">
          <p>
            Expense categories help you track where your business spends money. Categorizing expenses makes it easier to
            create budgets, identify cost-saving opportunities, and prepare for tax time.
          </p>
          <p className="mt-2">
            Fixed expenses stay roughly the same each month (like rent), while variable expenses change based on
            business activity (like inventory).
          </p>
        </CardContent>
      </Card>

      {expenseCategories.length > 0 && (
        <div className="rounded-lg border bg-red-50 p-4 dark:bg-red-950/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="font-medium text-red-700 dark:text-red-300">Total Monthly Expenses</span>
            </div>
            <div className="text-xl font-bold text-red-700 dark:text-red-300">
              ${totalMonthlyExpenses.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {expenseCategories.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No expense categories added yet</AlertTitle>
          <AlertDescription>
            Click the "Add Expense Category" button below to start adding your business expenses.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {expenseCategories.map((category, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Expense Category {index + 1}
              </CardTitle>
              <CardDescription>Tell us about your business expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="text-sm font-medium flex items-center gap-1">
                        Category Name
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>What do you call this expense category?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Select value={category.name} onValueChange={(value) => updateExpenseCategory(index, "name", value)}>
                  <SelectTrigger className={errors[`name-${index}`] ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select or enter category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`name-${index}`] && <p className="text-sm text-destructive">{errors[`name-${index}`]}</p>}
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
                      <p>Provide more details about this expense category</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Textarea
                  placeholder="E.g., Monthly office rent and utilities"
                  value={category.description}
                  onChange={(e) => updateExpenseCategory(index, "description", e.target.value)}
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
                      <p>How much do you typically spend on this category each month?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={category.estimatedMonthly || ""}
                    onChange={(e) =>
                      updateExpenseCategory(index, "estimatedMonthly", Number.parseFloat(e.target.value) || 0)
                    }
                    className={`pl-6 ${errors[`estimatedMonthly-${index}`] ? "border-destructive" : ""}`}
                  />
                </div>
                {errors[`estimatedMonthly-${index}`] && (
                  <p className="text-sm text-destructive">{errors[`estimatedMonthly-${index}`]}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id={`fixed-expense-${index}`}
                  checked={category.isFixed}
                  onCheckedChange={(checked) => updateExpenseCategory(index, "isFixed", checked)}
                />
                <Label htmlFor={`fixed-expense-${index}`} className="flex items-center gap-1">
                  This is a fixed expense
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Fixed expenses stay roughly the same each month (like rent or subscriptions)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => removeExpenseCategory(index)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Remove Expense Category
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={addExpenseCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense Category
        </Button>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleNext}>{expenseCategories.length === 0 ? "Skip for now" : "Continue"}</Button>
        </div>
      </div>
    </div>
  )
}

