export type TransactionType = "INCOME" | "EXPENSE"
export type AccountType = "CASH" | "BANK" | "CREDIT"
export type TransactionStatus = "Processing" | "Completed" | "Failed"

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  description: string
  createdAt: string
  businessId: string
  category: string
  date: string
  updatedAt: string
  accountType: AccountType
  aiConfidence?: number
  bankStatementId?: string
  notes?: string
}

export interface TransactionFilters {
  month?: string
  type?: TransactionType
  account?: AccountType
  status?: TransactionStatus
}

