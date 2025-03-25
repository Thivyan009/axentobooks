import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency } from '@/lib/types/currency'

interface CurrencyStore {
  selectedCurrency: Currency
  exchangeRates: Record<string, number>
  setSelectedCurrency: (currency: Currency) => void
  setExchangeRates: (rates: Record<string, number>) => void
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number
  initializeCurrency: (currency: Currency) => void
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      selectedCurrency: {
        code: 'USD',
        symbol: '$',
        flag: '🇺🇸',
        name: 'US Dollar'
      },
      exchangeRates: {},
      setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
      setExchangeRates: (rates) => set({ exchangeRates: rates }),
      convertAmount: (amount, fromCurrency, toCurrency) => {
        const rates = get().exchangeRates
        if (!rates[fromCurrency] || !rates[toCurrency]) return amount
        
        // Convert to USD first (base currency)
        const amountInUSD = amount / rates[fromCurrency]
        // Convert from USD to target currency
        return amountInUSD * rates[toCurrency]
      },
      initializeCurrency: (currency) => {
        // Only initialize if the currency is different from the default
        if (currency.code !== 'USD') {
          set({ selectedCurrency: currency })
        }
      }
    }),
    {
      name: 'currency-storage'
    }
  )
) 