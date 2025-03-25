'use client'

import { useEffect } from 'react'
import { useCurrencyStore } from '@/lib/stores/currency-store'

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { setExchangeRates, selectedCurrency } = useCurrencyStore()

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const data = await response.json()
        setExchangeRates(data.rates)
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error)
      }
    }

    // Fetch rates immediately
    fetchRates()

    // Update rates every hour
    const interval = setInterval(fetchRates, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [setExchangeRates])

  return <>{children}</>
} 