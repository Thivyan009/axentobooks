import { z } from "zod"

export const transactionSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  type: z.enum(["expense", "income"]),
  account: z.enum(["cash", "bank", "credit"]),
  category: z.string(),
  amount: z.number().positive({ message: "Amount must be positive" }),
  description: z.string().optional(),
})

export type Transaction = {
  id: string
  date: string
  status: "Processing" | "Completed" | "Failed"
} & z.infer<typeof transactionSchema> 