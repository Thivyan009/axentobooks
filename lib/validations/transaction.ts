import * as z from "zod"

export const transactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be greater than 0"),
  type: z.enum(["income", "expense"], {
    required_error: "Type is required",
  }),
  category: z.string().min(1, "Category is required"),
  account: z.string().min(1, "Account is required"),
  date: z.date({
    required_error: "Date is required",
  }),
})

export type TransactionFormValues = z.infer<typeof transactionSchema> 