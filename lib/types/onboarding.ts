export type BusinessInfo = {
  name: string
  industry: string
  registrationNumber?: string
  taxId?: string
}

export type FinancialGoal = {
  title: string
  targetAmount: number
  deadline: Date
  status: "IN_PROGRESS" | "COMPLETED" | "OVERDUE"
}

export type Asset = {
  description: string
  type: string
  value: number
  purchaseDate?: Date
}

export type Liability = {
  name: string
  type: "CURRENT" | "LONG_TERM"
  amount: number
  dueDate?: Date
}

export type Equity = {
  type: "OWNER_EQUITY" | "RETAINED_EARNINGS"
  amount: number
  description?: string
}

export type OnboardingData = {
  businessInfo: BusinessInfo
  financialGoals: FinancialGoal[]
  assets: Asset[]
  liabilities: Liability[]
  equity: Equity[]
}

