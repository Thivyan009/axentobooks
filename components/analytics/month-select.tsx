"use client"

import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MonthSelectProps {
  value: string // Expected format: YYYY-MM
  onValueChange: (value: string) => void
  disabled?: boolean
}

// Generate last 12 months as options
function getMonthOptions() {
  const options = []
  const today = new Date()
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    // Ensure consistent YYYY-MM format
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = format(date, "MMMM yyyy")
    options.push({ value, label })
  }
  
  return options
}

const monthOptions = getMonthOptions()

export function MonthSelect({ value, onValueChange, disabled }: MonthSelectProps) {
  // Find the matching option for the current value
  const selectedOption = monthOptions.find(option => option.value === value)
  
  return (
    <Select 
      value={value} 
      onValueChange={onValueChange} 
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select month">
          {selectedOption?.label || 'Select month'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {monthOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

