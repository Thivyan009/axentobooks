"use client"

import { useState, useEffect } from "react"
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
import { businessInfoSchema, type BusinessInfo } from "@/lib/validations/business"

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

const COUNTRY_OPTIONS = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "sg", label: "Singapore" },
  { value: "my", label: "Malaysia" },
  { value: "in", label: "India" },
  { value: "lk", label: "Sri Lanka" },
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
  { value: "corporation", label: "Corporation" },
  { value: "llc", label: "Limited Liability Company (LLC)" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "cooperative", label: "Cooperative" },
  { value: "other", label: "Other" },
]

const FISCAL_YEAR_END_OPTIONS = [
  { value: "12-31", label: "December 31" },
  { value: "03-31", label: "March 31" },
  { value: "06-30", label: "June 30" },
  { value: "09-30", label: "September 30" },
]

const ACCOUNTING_METHOD_OPTIONS = [
  { value: "cash", label: "Cash Basis" },
  { value: "accrual", label: "Accrual Basis" },
  { value: "hybrid", label: "Hybrid Method" },
  { value: "not_sure", label: "Not Sure" },
]

interface BusinessInfoStepProps {
  form: {
    getValues: () => { businessInfo: BusinessInfo }
    setValue: (field: string, value: BusinessInfo) => void
  }
  onNext: () => void
  onBack: () => void
  formData?: { businessInfo: BusinessInfo }
  updateFormData?: (field: string, data: BusinessInfo) => void
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

  useEffect(() => {
    if (formData?.businessInfo) {
      setBusinessInfo(formData.businessInfo)
    }
  }, [formData])

  const updateField = (field: keyof BusinessInfo, value: string | Date | null) => {
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
    const validationResult = businessInfoSchema.safeParse(businessInfo)
    
    if (!validationResult.success) {
      const newErrors: { [key: string]: string } = {}
      for (const error of validationResult.error.errors) {
        if (error.path[0]) {
          newErrors[error.path[0] as string] = error.message
        }
      }
      setErrors(newErrors)
      return false
    }

    setErrors({})
    return true
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
        <p className="text-muted-foreground">
          Please provide accurate information about your business to help us serve you better.
        </p>
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
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Please provide your complete business details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
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
                value={businessInfo.name || ""}
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
                    <TooltipContent className="max-w-xs">
                      <p>Select the main industry your business operates in. This helps us provide relevant financial insights and recommendations specific to your industry.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select 
                value={businessInfo.industry || ""} 
                onValueChange={(value) => updateField("industry", value)}
              >
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
                    <TooltipContent className="max-w-xs">
                      <p>The size of your business based on number of employees. This helps us customize features and reports for your business scale:
                        • Sole Proprietor: Just you
                        • Micro: 1-9 employees
                        • Small: 10-49 employees
                        • Medium: 50-249 employees
                        • Large: 250+ employees
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select 
                value={businessInfo.size || ""} 
                onValueChange={(value) => updateField("size", value)}
              >
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
              <Label htmlFor="business-type" className="flex items-center gap-1">
                Business Type
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>The legal structure of your business. This affects how you pay taxes and your legal responsibilities.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select 
                value={businessInfo.businessType || ""} 
                onValueChange={(value) => updateField("businessType", value)}
              >
                <SelectTrigger id="business-type" className={errors.businessType ? "border-destructive" : ""}>
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
              {errors.businessType && <p className="text-sm text-destructive">{errors.businessType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-start-date" className="flex items-center gap-1">
                Business Start Date (Optional)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>The date your business officially started operations. This helps us calculate your business age and provide relevant financial reports. For new businesses, use today's date.</p>
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
                      errors.startDate ? "border-destructive" : ""
                    }`}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {businessInfo.startDate ? format(businessInfo.startDate, "PPP") : "Select date (optional)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 border-b">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Select Date</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateField("startDate", null)}
                        >
                          Clear
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateField("startDate", new Date())}
                        >
                          Today
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CalendarComponent
                    mode="single"
                    selected={businessInfo.startDate || undefined}
                    onSelect={(date) => updateField("startDate", date)}
                    initialFocus
                    disabled={(date) => date > new Date()}
                    className="rounded-md border"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                      day_range_end: "day-range-end",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accounting-method" className="flex items-center gap-1">
                Accounting Method
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>How you'll record your income and expenses:
                        • Cash Basis: Record transactions when money changes hands (simpler, good for small businesses)
                        • Accrual Basis: Record transactions when they're earned/incurred (more accurate, required for larger businesses)
                        • Hybrid: Mix of both methods
                        • Not Sure: We'll help you choose based on your needs
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select 
                value={businessInfo.accountingMethod || ""} 
                onValueChange={(value) => updateField("accountingMethod", value)}
              >
                <SelectTrigger id="accounting-method" className={errors.accountingMethod ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select accounting method" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNTING_METHOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accountingMethod && <p className="text-sm text-destructive">{errors.accountingMethod}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-identifier" className="flex items-center gap-1">
                Tax Identifier
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Your business tax ID number or registration number. This could be your EIN (Employer Identification Number), VAT number, or any other government-issued business identification number.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="tax-identifier"
                placeholder="Tax ID / Registration Number"
                value={businessInfo.taxIdentifier || ""}
                onChange={(e) => updateField("taxIdentifier", e.target.value)}
                className={errors.taxIdentifier ? "border-destructive" : ""}
              />
              {errors.taxIdentifier && <p className="text-sm text-destructive">{errors.taxIdentifier}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-address" className="flex items-center gap-1">
                Business Address
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Enter your business's official registered address. This will be used on invoices and official documents.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="business-address"
                placeholder="123 Business St, City, Country"
                value={businessInfo.address || ""}
                onChange={(e) => updateField("address", e.target.value)}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-phone" className="flex items-center gap-1">
                Phone Number
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Your business contact number that customers and partners can use to reach you.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="business-phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={businessInfo.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-email" className="flex items-center gap-1">
                Business Email
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Your official business email address. This will be used for invoices and communications with customers.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="business-email"
                type="email"
                placeholder="contact@business.com"
                value={businessInfo.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-website" className="flex items-center gap-1">
                Website
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Your business website address, if you have one. This can be added to your invoices and documents.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="business-website"
                type="url"
                placeholder="https://www.business.com"
                value={businessInfo.website || ""}
                onChange={(e) => updateField("website", e.target.value)}
                className={errors.website ? "border-destructive" : ""}
              />
              {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiscal-year-end" className="flex items-center gap-1">
                Fiscal Year End
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>The date your financial year ends. This is important for tax purposes and annual reporting.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select
                value={businessInfo.fiscalYearEnd || ""}
                onValueChange={(value) => updateField("fiscalYearEnd", value)}
              >
                <SelectTrigger id="fiscal-year-end" className={errors.fiscalYearEnd ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select fiscal year end" />
                </SelectTrigger>
                <SelectContent>
                  {FISCAL_YEAR_END_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fiscalYearEnd && <p className="text-sm text-destructive">{errors.fiscalYearEnd}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  )
}

