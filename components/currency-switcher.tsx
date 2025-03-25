"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useCurrencyStore } from "@/lib/stores/currency-store"
import { currencies } from "@/lib/types/currency"

export function CurrencySwitcher() {
  const [open, setOpen] = useState(false)
  const { selectedCurrency, setSelectedCurrency } = useCurrencyStore()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch currency</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => {
              setSelectedCurrency(currency)
              setOpen(false)
            }}
            className="flex items-center gap-2"
          >
            <span>{currency.flag}</span>
            <span>{currency.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 