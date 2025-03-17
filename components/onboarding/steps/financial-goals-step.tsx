"use client"

import { useState } from "react"
import { AlertCircle, Calendar, BarChartIcon as ChartBar, DollarSign, Info, Plus, Target, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { FinancialGoal } from "@/lib/types/onboarding"

const GOAL_TYPES = [
  {
    value: "increase_revenue",
    label: "Increase Revenue",
    icon: ChartBar,
    description: "Grow your business income",
  },
  {
    value: "reduce_expenses",
    label: "Reduce Expenses",
    icon: DollarSign,
    description: "Cut costs and improve efficiency",
  },
  {
    value: "improve_cash_flow",
    label: "Improve Cash Flow",
    icon: DollarSign,
    description: "Better manage your money coming in and going out",
  },
  {
    value: "save_for_taxes",
    label: "Save for Taxes",
    icon: DollarSign,
    description: "Set aside money for upcoming tax payments",
  },
  {
    value: "business_expansion",
    label: "Business Expansion",
    icon: Target,
    description: "Grow your business operations",
  },
  {
    value: "debt_reduction",
    label: "Debt Reduction",
    icon: DollarSign,
    description: "Pay down business loans or other debts",
  },
  {
    value: "other",
    label: "Other Goal",
    icon: Target,
    description: "Any other financial goal for your business",
  },
]

const PRIORITY_OPTIONS = [
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
]

interface FinancialGoalsStepProps {
  form: {
    getValues: () => any
    setValue: (field: string, value: any) => void
  }
  onNext: () => void
  onBack: () => void
  formData?: any
  updateFormData?: (field: string, data: any) => void
}

export function FinancialGoalsStep({ form, onNext, onBack, formData, updateFormData }: FinancialGoalsStepProps) {
  const [goals, setGoals] = useState<FinancialGoal[]>(form.getValues().financialGoals || [])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { toast } = useToast()

  const validateGoal = (goal: FinancialGoal, index: number) => {
    const newErrors: { [key: string]: string } = {}

    if (!goal.type) {
      newErrors[`type-${index}`] = "Please select a goal type"
    }
    if (!goal.description) {
      newErrors[`description-${index}`] = "Please describe your goal"
    }
    if (!goal.priority) {
      newErrors[`priority-${index}`] = "Please select a priority"
    }

    return newErrors
  }

  const addGoal = () => {
    const newGoal = {
      type: "",
      description: "",
      targetAmount: 0,
      targetDate: null,
      priority: "",
    }
    setGoals([...goals, newGoal])
    toast({
      title: "Goal Added",
      description: "Now fill in the details about your financial goal.",
    })
  }

  const removeGoal = (index: number) => {
    const updatedGoals = goals.filter((_, i) => i !== index)
    setGoals(updatedGoals)
    form.setValue("financialGoals", updatedGoals)
    if (updateFormData) {
      updateFormData("financialGoals", updatedGoals)
    }

    // Clear errors for removed goal
    const newErrors = { ...errors }
    delete newErrors[`type-${index}`]
    delete newErrors[`description-${index}`]
    delete newErrors[`priority-${index}`]
    setErrors(newErrors)

    toast({
      title: "Goal Removed",
      description: "The goal has been removed from your list.",
    })
  }

  const updateGoal = (index: number, field: keyof FinancialGoal, value: any) => {
    const updatedGoals = goals.map((goal, i) => {
      if (i === index) {
        const updatedGoal = { ...goal, [field]: value }
        const validationErrors = validateGoal(updatedGoal, index)
        setErrors((prev) => ({ ...prev, ...validationErrors }))
        return updatedGoal
      }
      return goal
    })
    setGoals(updatedGoals)
    form.setValue("financialGoals", updatedGoals)
    if (updateFormData) {
      updateFormData("financialGoals", updatedGoals)
    }
  }

  const handleNext = () => {
    let hasErrors = false
    const allErrors: { [key: string]: string } = {}

    goals.forEach((goal, index) => {
      const goalErrors = validateGoal(goal, index)
      if (Object.keys(goalErrors).length > 0) {
        hasErrors = true
        Object.assign(allErrors, goalErrors)
      }
    })

    if (hasErrors) {
      setErrors(allErrors)
      toast({
        title: "Please check your information",
        description: "Some goals need more details before you can continue.",
        variant: "destructive",
      })
      return
    }

    form.setValue("financialGoals", goals)
    if (updateFormData) {
      updateFormData("financialGoals", goals)
    }
    onNext()
  }

  const getSelectedGoalType = (value: string) => {
    return GOAL_TYPES.find((type) => type.value === value)
  }

  const renderGoalIcon = (type: string) => {
    const goalType = getSelectedGoalType(type)
    if (!goalType || !goalType.icon) return null

    const IconComponent = goalType.icon
    return <IconComponent className="h-5 w-5 text-primary" />
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold">What are your financial goals?</h2>
        <p className="text-muted-foreground">
          Setting clear financial goals helps us tailor your experience and provide relevant insights
        </p>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-300">
            <Info className="h-5 w-5" />
            Why set financial goals?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 dark:text-blue-300">
          <p>
            Financial goals give your business direction and help measure success. They can be short-term (like monthly
            revenue targets) or long-term (like business expansion). Setting specific, measurable goals increases your
            chances of achieving them.
          </p>
        </CardContent>
      </Card>

      {goals.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No goals added yet</AlertTitle>
          <AlertDescription>Click the "Add Goal" button below to start adding your financial goals.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {goals.map((goal, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {goal.type && renderGoalIcon(goal.type)}
                Goal {index + 1}
              </CardTitle>
              <CardDescription>Tell us about your financial goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="text-sm font-medium flex items-center gap-1">
                        Goal Type
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Select the type of financial goal you want to achieve</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Select value={goal.type} onValueChange={(value) => updateGoal(index, "type", value)}>
                  <SelectTrigger className={errors[`type-${index}`] ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_TYPES.map((type) => (
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
                {goal.type && (
                  <p className="text-sm text-muted-foreground">{getSelectedGoalType(goal.type)?.description}</p>
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
                      <p>Describe your goal in more detail</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Textarea
                  placeholder="E.g., Increase monthly revenue by 20% by the end of the year"
                  value={goal.description}
                  onChange={(e) => updateGoal(index, "description", e.target.value)}
                  className={errors[`description-${index}`] ? "border-destructive" : ""}
                />
                {errors[`description-${index}`] && (
                  <p className="text-sm text-destructive">{errors[`description-${index}`]}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="text-sm font-medium flex items-center gap-1">
                          Target Amount (Optional)
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </label>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>The financial target for this goal, if applicable</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={goal.targetAmount || ""}
                      onChange={(e) => updateGoal(index, "targetAmount", Number.parseFloat(e.target.value) || 0)}
                      className="pl-6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="text-sm font-medium flex items-center gap-1">
                          Target Date (Optional)
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </label>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>When do you want to achieve this goal?</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !goal.targetDate ? "text-muted-foreground" : ""
                        }`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {goal.targetDate ? format(goal.targetDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={goal.targetDate || undefined}
                        onSelect={(date) => updateGoal(index, "targetDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="text-sm font-medium flex items-center gap-1">
                        Priority
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>How important is this goal to your business?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Select value={goal.priority} onValueChange={(value) => updateGoal(index, "priority", value)}>
                  <SelectTrigger className={errors[`priority-${index}`] ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`priority-${index}`] && (
                  <p className="text-sm text-destructive">{errors[`priority-${index}`]}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeGoal(index)}>
                <Trash className="mr-2 h-4 w-4" />
                Remove Goal
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={addGoal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleNext}>{goals.length === 0 ? "Skip for now" : "Continue"}</Button>
        </div>
      </div>
    </div>
  )
}

