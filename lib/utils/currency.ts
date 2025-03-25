import { useCurrencyStore } from '@/lib/stores/currency-store'

// Map of currency codes to their locales
const CURRENCY_LOCALES: Record<string, string> = {
  USD: 'en-US',
  LKR: 'si-LK',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  CNY: 'zh-CN',
  INR: 'en-IN',
  // Add more currency-locale mappings as needed
}

export function formatCurrency(amount: number, currencyCode?: string) {
  const { selectedCurrency, convertAmount } = useCurrencyStore.getState()
  const targetCurrency = currencyCode || selectedCurrency.code

  // Convert amount to target currency if needed
  const convertedAmount = convertAmount(amount, 'USD', targetCurrency)

  // Get the appropriate locale for the currency, fallback to en-US if not found
  const locale = CURRENCY_LOCALES[targetCurrency] || 'en-US'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: targetCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedAmount)
} 