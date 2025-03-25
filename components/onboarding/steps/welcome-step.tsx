"use client"

import { motion } from "framer-motion"
import { ArrowRight, BarChart3, BookOpen, DollarSign, PiggyBank } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { currencies } from "@/lib/types/currency"
import { useCurrencyStore } from "@/lib/store/currency-store"

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { selectedCurrency, setSelectedCurrency } = useCurrencyStore()

  const handleCurrencyChange = (value: string) => {
    const currency = currencies.find(c => c.code === value)
    if (currency) {
      setSelectedCurrency(currency)
      useCurrencyStore.getState().initializeCurrency(currency)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Axento Books</h1>
        <p className="mt-2 text-muted-foreground">Let's set up your business finances in just a few simple steps</p>
      </div>

      <div className="max-w-md mx-auto">
        <Label htmlFor="currency">Select your preferred currency</Label>
        <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
          <SelectTrigger id="currency" className="w-full">
            <SelectValue placeholder="Select a currency" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[200px]">
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <span className="flex items-center gap-2">
                    <span>{currency.flag}</span>
                    <span>{currency.name}</span>
                    <span className="text-muted-foreground">({currency.symbol})</span>
                  </span>
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Learn Financial Basics</h3>
                <p className="text-sm text-muted-foreground">We'll explain key financial concepts in simple terms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <PiggyBank className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Track Your Assets</h3>
                <p className="text-sm text-muted-foreground">Record what your business owns and its value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Manage Liabilities</h3>
                <p className="text-sm text-muted-foreground">Keep track of what your business owes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Visualize Your Finances</h3>
                <p className="text-sm text-muted-foreground">See clear breakdowns of your financial position</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button size="lg" onClick={onNext} className="mt-4 flex items-center gap-2">
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  )
}

