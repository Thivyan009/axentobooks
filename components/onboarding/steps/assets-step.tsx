"use client"

import { useState } from "react"
import { AlertCircle, Building2, Car, CreditCard, Home, Info, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import type { Asset } from "@/lib/types/onboarding"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { formatCurrency } from "@/lib/types/currency"

const ASSET_TYPES = [
  {
    value: "cash",
    label: "Cash & Bank Accounts",
    icon: CreditCard,
    description: "Money in your bank accounts or cash on hand",
    example: "Checking Account: $5,000",
  },
  {
    value: "property",
    label: "Property",
    icon: Home,
    description: "Buildings, land, or office space your business owns",
    example: "Office Space: $150,000",
  },
  {
    value: "vehicles",
    label: "Vehicles & Equipment",
    icon: Car,
    description: "Cars, trucks, machinery, or other equipment",
    example: "Delivery Van: $25,000",
  },
  {
    value: "business",
    label: "Other Business Assets",
    icon: Building2,
    description: "Inventory, furniture, computers, or other items",
    example: "Inventory: $10,000",
  },
]

interface AssetsStepProps {
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

export function AssetsStep({ form, onNext, onBack, formData, updateFormData, isSettings = false }: AssetsStepProps) {
  const [assets, setAssets] = useState<Asset[]>(form.getValues().assets || [])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { toast } = useToast()
  const { selectedCurrency } = useCurrencyStore()

  const validateAsset = (asset: Asset, index: number) => {
    const newErrors: { [key: string]: string } = {}

    if (!asset.type) {
      newErrors[`type-${index}`] = "Please select a type"
    }
    if (!asset.description) {
      newErrors[`description-${index}`] = "Please add a short description"
    }
    if (!asset.value || asset.value <= 0) {
      newErrors[`value-${index}`] = "Please enter a value greater than 0"
    }

    return newErrors
  }

  const addAsset = () => {
    const newAsset = {
      type: "",
      description: "",
      value: 0,
    }
    setAssets([...assets, newAsset])
    toast({
      title: "Item Added",
      description: "Now fill in the details about what your business owns.",
    })
  }

  const removeAsset = (index: number) => {
    const updatedAssets = assets.filter((_, i) => i !== index)
    setAssets(updatedAssets)
    form.setValue("assets", updatedAssets)
    if (updateFormData) {
      updateFormData("assets", updatedAssets)
    }

    // Clear errors for removed asset
    const newErrors = { ...errors }
    delete newErrors[`type-${index}`]
    delete newErrors[`description-${index}`]
    delete newErrors[`value-${index}`]
    setErrors(newErrors)

    toast({
      title: "Item Removed",
      description: "The item has been removed from your list.",
    })
  }

  const updateAsset = (index: number, field: keyof Asset, value: any) => {
    const updatedAssets = assets.map((asset, i) => {
      if (i === index) {
        const updatedAsset = { ...asset, [field]: value }
        const validationErrors = validateAsset(updatedAsset, index)
        setErrors((prev) => ({ ...prev, ...validationErrors }))
        return updatedAsset
      }
      return asset
    })
    setAssets(updatedAssets)
    form.setValue("assets", updatedAssets)
    if (updateFormData) {
      updateFormData("assets", updatedAssets)
    }
  }

  const handleNext = () => {
    let hasErrors = false
    const allErrors: { [key: string]: string } = {}

    assets.forEach((asset, index) => {
      const assetErrors = validateAsset(asset, index)
      if (Object.keys(assetErrors).length > 0) {
        hasErrors = true
        Object.assign(allErrors, assetErrors)
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

    form.setValue("assets", assets)
    if (updateFormData) {
      updateFormData("assets", assets)
    }
    onNext()
  }

  const getSelectedAssetType = (value: string) => {
    return ASSET_TYPES.find((type) => type.value === value)
  }

  // Calculate total assets value
  const totalAssetsValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0)

  const renderAssetIcon = (type: string) => {
    const assetType = getSelectedAssetType(type)
    if (!assetType || !assetType.icon) return null

    const IconComponent = assetType.icon
    return <IconComponent className="h-5 w-5 text-primary" />
  }

  return (
    <div className={`space-y-6 ${isSettings ? "" : "max-w-3xl mx-auto"}`}>
      {!isSettings && (
        <div>
          <h2 className="text-2xl font-bold">What does your business own?</h2>
          <p className="text-muted-foreground">
            These are things your business owns that have value - we call these "assets"
          </p>
        </div>
      )}

      {!isSettings && (
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-300">
              <Info className="h-5 w-5" />
              Understanding Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700 dark:text-blue-300">
            <p>
              Assets are items your business owns that have value. Think of them as resources that benefit your
              business.
            </p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/50 dark:bg-blue-900/30 p-3">
                <h4 className="font-medium">Examples include:</h4>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Cash in business bank accounts</li>
                  <li>Business equipment and vehicles</li>
                  <li>Inventory and supplies</li>
                  <li>Real estate owned by the business</li>
                </ul>
              </div>
              <div className="rounded-lg bg-white/50 dark:bg-blue-900/30 p-3">
                <h4 className="font-medium">Tips:</h4>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Use estimates if you don't know exact values</li>
                  <li>Only include items used primarily for business</li>
                  <li>For bank accounts, use current balances</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {assets.length > 0 && (
        <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-700 dark:text-green-300">Total Assets Value</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">
              {formatCurrency(totalAssetsValue, selectedCurrency.code)}
            </div>
          </div>
        </div>
      )}

      {assets.length === 0 && (
        <Alert className="bg-background border shadow-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No assets added yet</AlertTitle>
          <AlertDescription>
            Click the "Add Item" button below to start adding what your business owns.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {assets.map((asset, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {asset.type && renderAssetIcon(asset.type)}
                Item {index + 1}
              </CardTitle>
              <CardDescription>Tell us about something your business owns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="text-sm font-medium flex items-center gap-1">
                        What type of item is this?
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Select the category that best describes this asset</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Select value={asset.type} onValueChange={(value) => updateAsset(index, "type", value)}>
                  <SelectTrigger className={errors[`type-${index}`] ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_TYPES.map((type) => (
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
                {asset.type && (
                  <p className="text-sm text-muted-foreground">{getSelectedAssetType(asset.type)?.description}</p>
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
                      <p>Briefly describe this item (e.g., "Company Car", "Office Computer")</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Input
                  placeholder={
                    asset.type ? getSelectedAssetType(asset.type)?.example.split(":")[0] : "E.g., Business Checking"
                  }
                  value={asset.description}
                  onChange={(e) => updateAsset(index, "description", e.target.value)}
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
                        What is it worth?
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Estimate how much this item is worth in dollars</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{selectedCurrency.symbol}</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={asset.value || ""}
                    onChange={(e) => updateAsset(index, "value", Number.parseFloat(e.target.value) || 0)}
                    className={`pl-6 ${errors[`value-${index}`] ? "border-destructive" : ""}`}
                  />
                </div>
                {errors[`value-${index}`] && <p className="text-sm text-destructive">{errors[`value-${index}`]}</p>}
                {asset.type && (
                  <p className="text-sm text-muted-foreground">
                    Example: {getSelectedAssetType(asset.type)?.example.split(": ")[1]}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeAsset(index)}>
                <Trash className="mr-2 h-4 w-4" />
                Remove Item
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={addAsset}>
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

