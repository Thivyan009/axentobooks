"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCurrencyStore } from "@/lib/store/currency-store"
import { currencies } from "@/lib/types/currency"

export function CurrencySelector() {
  const { selectedCurrency, setSelectedCurrency } = useCurrencyStore()

  const handleCurrencyChange = (value: string) => {
    const currency = currencies.find(c => c.code === value)
    if (currency) {
      setSelectedCurrency(currency)
    }
  }

  return (
    <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((curr) => (
          <SelectItem key={curr.code} value={curr.code}>
            <span className="flex items-center gap-2">
              <span>{curr.flag}</span>
              <span>{curr.code}</span>
              <span className="text-muted-foreground">({curr.symbol})</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

