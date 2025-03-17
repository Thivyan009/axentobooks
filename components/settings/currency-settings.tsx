"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { currencies } from "@/lib/types/currency"

export function CurrencySettings() {
  const { selectedCurrency, setSelectedCurrency } = useCurrencyStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
        <CardDescription>Choose your preferred currency for displaying monetary values.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Display Currency</Label>
          <RadioGroup
            defaultValue={selectedCurrency.code}
            onValueChange={(value) => {
              const currency = currencies.find((c) => c.code === value)
              if (currency) {
                setSelectedCurrency(currency)
              }
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {currencies.map((c) => (
                <div key={c.code}>
                  <RadioGroupItem value={c.code} id={c.code} className="peer sr-only" />
                  <Label
                    htmlFor={c.code}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-2xl mb-2">{c.flag}</span>
                    <span className="font-semibold">{c.code}</span>
                    <span className="text-sm text-muted-foreground">{c.name}</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}

