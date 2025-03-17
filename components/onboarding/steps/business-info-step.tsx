"use client"

import { useState } from "react"
import { Calendar, HelpCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import type { BusinessInfo } from "@/lib/types/onboarding"

const INDUSTRY_OPTIONS = [
  { value: "retail", label: "Retail" },
  { value: "food_service", label: "Food Service" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "construction", label: "Construction" },
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "professional_services", label: "Professional Services" },
  { value: "real_estate", label: "Real Estate" },
  { value: "other", label: "Other" },
]

const BUSINESS_SIZE_OPTIONS = [
  { value: "sole_proprietor", label: "Sole Proprietor" },
  { value: "micro", label: "Micro (1-9 employees)" },
  { value: "small", label: "Small (10-49 employees)" },
  { value: "medium", label: "Medium (50-249 employees)" },
  { value: "large", label: "Large (250+ employees)" },
]

const BUSINESS_TYPE_OPTIONS = [
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "Limited Liability Company (LLC)" },
  { value: "corporation", label: "Corporation" },
  { value: "s_corporation", label: "S Corporation" },
  { value: "nonprofit", label: "Nonprofit" },
]

const ACCOUNTING_METHOD_OPTIONS = [
  { value: "cash", label: "Cash Basis" },
  { value: "accrual", label: "Accrual Basis" },
  { value: "hybrid", label: "Hybrid Method" },
  { value: "not_sure", label: "Not Sure" },
]

interface BusinessInfoStepProps {
  form: {
    getValues: () => any
    setValue: (field: string, value: any) => void
  }
  onNext: () => void
  onBack: () => void
  formData?: any
  updateFormData?: (field: string, data: any) => void
}

export function BusinessInfoStep({ form, onNext, onBack, formData, updateFormData }: BusinessInfoStepProps) {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(
    form.getValues().businessInfo || {
      name: "",
      industry: "",
      size: "",
      startDate: null,
      taxIdentifier: "",
      businessType: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      fiscalYearEnd: "",
      accountingMethod: "",
    },
  )
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateField = (field: keyof BusinessInfo, value: any) => {
    const updatedInfo = { ...businessInfo, [field]: value }
    setBusinessInfo(updatedInfo)
    form.setValue("businessInfo", updatedInfo)
    if (updateFormData) {
      updateFormData("businessInfo", updatedInfo)
    }

    // Clear error for this field if it exists
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!businessInfo.name) {
      newErrors.name = "Business name is required"
    }
    if (!businessInfo.industry) {
      newErrors.industry = "Please select an industry"
    }
    if (!businessInfo.size) {
      newErrors.size = "Please select a business size"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold">Tell us about your business</h2>
        <p className="text-muted-foreground">This information helps us customize your financial experience</p>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-300">
            <Info className="h-5 w-5" />
            Why we need this information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 dark:text-blue-300">
          <p>
            Your business details help us customize your financial dashboard, reports, and recommendations. We'll only
            ask for essential information to get you started.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Let's start with the essentials about your business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name" className="flex items-center gap-1">
              Business Name
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The legal name of your business</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="business-name"
              placeholder="Acme Corporation"
              value={businessInfo.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-industry" className="flex items-center gap-1">
              Industry
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The primary industry your business operates in</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select value={businessInfo.industry} onValueChange={(value) => updateField("industry", value)}>
              <SelectTrigger id="business-industry" className={errors.industry ? "border-destructive" : ""}>
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && <p className="text-sm text-destructive">{errors.industry}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-size" className="flex items-center gap-1">
              Business Size
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The size of your business based on number of employees</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select value={businessInfo.size} onValueChange={(value) => updateField("size", value)}>
              <SelectTrigger id="business-size" className={errors.size ? "border-destructive" : ""}>
                <SelectValue placeholder="Select business size" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.size && <p className="text-sm text-destructive">{errors.size}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-start-date" className="flex items-center gap-1">
              Business Start Date
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>When did you start your business operations?</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="business-start-date"
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !businessInfo.startDate ? "text-muted-foreground" : ""
                  }`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {businessInfo.startDate ? format(businessInfo.startDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={businessInfo.startDate || undefined}
                  onSelect={(date) => updateField("startDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax-identifier" className="flex items-center gap-1">
              Tax ID Number (Optional)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your business tax identification number (EIN, SSN, etc.)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="tax-identifier"
              placeholder="XX-XXXXXXX"
              value={businessInfo.taxIdentifier}
              onChange={(e) => updateField("taxIdentifier", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full" onClick={() => setShowAdvanced(!showAdvanced)}>
        {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
      </Button>

      {showAdvanced && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
            <CardDescription>These details help us further customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-type">Business Type</Label>
              <Select
                value={businessInfo.businessType || ""}
                onValueChange={(value) => updateField("businessType", value)}
              >
                <SelectTrigger id="business-type">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-address">Business Address</Label>
              <Input
                id="business-address"
                placeholder="123 Main St, City, State, ZIP"
                value={businessInfo.address || ""}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="business-phone">Phone Number</Label>
                <Input
                  id="business-phone"
                  placeholder="(555) 123-4567"
                  value={businessInfo.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-email">Email Address</Label>
                <Input
                  id="business-email"
                  type="email"
                  placeholder="contact@yourbusiness.com"
                  value={businessInfo.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-website">Website</Label>
              <Input
                id="business-website"
                placeholder="https://www.yourbusiness.com"
                value={businessInfo.website || ""}
                onChange={(e) => updateField("website", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fiscal-year-end" className="flex items-center gap-1">
                  Fiscal Year End
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The month when your business's fiscal year ends</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select
                  value={businessInfo.fiscalYearEnd || ""}
                  onValueChange={(value) => updateField("fiscalYearEnd", value)}
                >
                  <SelectTrigger id="fiscal-year-end">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">January</SelectItem>
                    <SelectItem value="february">February</SelectItem>
                    <SelectItem value="march">March</SelectItem>
                    <SelectItem value="april">April</SelectItem>
                    <SelectItem value="may">May</SelectItem>
                    <SelectItem value="june">June</SelectItem>
                    <SelectItem value="july">July</SelectItem>
                    <SelectItem value="august">August</SelectItem>
                    <SelectItem value="september">September</SelectItem>
                    <SelectItem value="october">October</SelectItem>
                    <SelectItem value="november">November</SelectItem>
                    <SelectItem value="december">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accounting-method" className="flex items-center gap-1">
                  Accounting Method
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The method you use to record income and expenses</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select
                  value={businessInfo.accountingMethod || ""}
                  onValueChange={(value) => updateField("accountingMethod", value)}
                >
                  <SelectTrigger id="accounting-method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNTING_METHOD_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleNext}>Continue</Button>
        </div>
      </div>
    </div>
  )
}

