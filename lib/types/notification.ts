export interface Notification {
  id: string
  title: string
  message: string
  type: "transaction" | "system" | "alert"
  read: boolean
  timestamp: string
}

