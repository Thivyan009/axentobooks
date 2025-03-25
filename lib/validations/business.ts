import { z } from "zod"

export const businessInfoSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  size: z.string().min(1, "Business size is required"),
  startDate: z.date().nullable().optional(),
  taxIdentifier: z.string().optional(),
  businessType: z.string().min(1, "Business type is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid website URL").optional(),
  fiscalYearEnd: z.string().min(1, "Fiscal year end is required"),
  accountingMethod: z.string().min(1, "Accounting method is required"),
})

export type BusinessInfo = z.infer<typeof businessInfoSchema>

export const onboardingSchema = z.object({
  businessInfo: businessInfoSchema,
  financialGoals: z.array(z.object({
    title: z.string().min(1, "Goal title is required"),
    targetAmount: z.number().min(0, "Target amount must be positive"),
    currentAmount: z.number().min(0, "Current amount must be positive"),
    deadline: z.date(),
    status: z.enum(["not_started", "in_progress", "completed"]),
  })),
  assets: z.array(z.object({
    name: z.string().min(1, "Asset name is required"),
    type: z.string().min(1, "Asset type is required"),
    value: z.number().min(0, "Asset value must be positive"),
    purchaseDate: z.date().optional(),
    description: z.string().optional(),
  })),
  liabilities: z.array(z.object({
    name: z.string().min(1, "Liability name is required"),
    type: z.string().min(1, "Liability type is required"),
    amount: z.number().min(0, "Liability amount must be positive"),
    dueDate: z.date().optional(),
    description: z.string().optional(),
  })),
  equity: z.array(z.object({
    type: z.string().min(1, "Equity type is required"),
    amount: z.number().min(0, "Equity amount must be positive"),
    description: z.string().optional(),
  })),
}) 