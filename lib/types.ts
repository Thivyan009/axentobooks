export type TransactionStatus = "Success" | "Processing" | "Failed"
export type TransactionType = "expense" | "income"
export type AccountType = "cash" | "bank" | "credit"

export interface Transaction {
  id: string
  name: string
  type: TransactionType
  account: AccountType
  category: string
  amount: number
  date: string
  status: TransactionStatus
}

export interface TransactionFilters {
  month?: string
  type?: TransactionType
  account?: AccountType
  status?: TransactionStatus
}

