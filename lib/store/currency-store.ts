import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency } from '@/lib/types/currency'

interface CurrencyStore {
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      selectedCurrency: { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
      setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
    }),
    {
      name: 'currency-storage',
    }
  )
) 