import { useCurrencyStore } from "@/lib/stores/currency-store"

export interface Currency {
  code: string
  symbol: string
  flag: string
  name: string
}

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound" },
  { code: "JPY", symbol: "¥", flag: "🇯🇵", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", flag: "🇦🇺", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", flag: "🇨🇦", name: "Canadian Dollar" },
  { code: "CHF", symbol: "Fr", flag: "🇨🇭", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", flag: "🇨🇳", name: "Chinese Yuan" },
  { code: "LKR", symbol: "₨", flag: "🇱🇰", name: "Sri Lankan Rupee" },
]

export function formatCurrency(amount: number, currencyCode: string): string {
  const { selectedCurrency, convertAmount } = useCurrencyStore.getState()
  
  // Convert amount to selected currency if different from original
  const convertedAmount = currencyCode !== selectedCurrency.code
    ? convertAmount(amount, currencyCode, selectedCurrency.code)
    : amount

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedCurrency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: Math.abs(convertedAmount) >= 1000000 ? 'compact' : 'standard',
    compactDisplay: 'short'
  })

  return formatter.format(convertedAmount)
}

export function getCurrencySymbol(currencyCode: string): string {
  const currency = currencies.find(c => c.code === currencyCode)
  return currency?.symbol || '$'
} 