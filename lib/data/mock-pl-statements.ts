import type { ProfitLossStatement } from "@/lib/types/ai"

export const mockPLStatement: ProfitLossStatement = {
  periodStart: "2024-01-01",
  periodEnd: "2024-01-31",
  revenue: [
    {
      category: "Product Sales",
      amount: 125000,
      items: [
        { description: "Software Licenses", amount: 75000 },
        { description: "Support Packages", amount: 50000 },
      ],
    },
    {
      category: "Service Revenue",
      amount: 85000,
      items: [
        { description: "Consulting Services", amount: 45000 },
        { description: "Implementation Services", amount: 40000 },
      ],
    },
    {
      category: "Other Income",
      amount: 15000,
      items: [
        { description: "Interest Income", amount: 5000 },
        { description: "Miscellaneous Income", amount: 10000 },
      ],
    },
  ],
  expenses: [
    {
      category: "Operating Expenses",
      amount: 95000,
      items: [
        { description: "Salaries and Wages", amount: 55000 },
        { description: "Office Rent", amount: 15000 },
        { description: "Utilities", amount: 5000 },
        { description: "Office Supplies", amount: 5000 },
        { description: "Software Subscriptions", amount: 15000 },
      ],
    },
    {
      category: "Marketing and Sales",
      amount: 35000,
      items: [
        { description: "Digital Marketing", amount: 20000 },
        { description: "Sales Commission", amount: 15000 },
      ],
    },
    {
      category: "Administrative",
      amount: 25000,
      items: [
        { description: "Insurance", amount: 10000 },
        { description: "Professional Fees", amount: 15000 },
      ],
    },
  ],
  summary: {
    totalRevenue: 225000,
    totalExpenses: 155000,
    netProfitLoss: 70000,
    profitMargin: 31.11,
    monthOverMonthGrowth: 15.5,
  },
  analysis: {
    insights: [
      "Strong revenue growth in software license sales",
      "Consulting services showing steady performance",
      "Operating expenses well managed within budget",
      "Healthy profit margin above industry average",
    ],
    recommendations: [
      "Consider expanding software product line",
      "Invest in marketing automation to reduce costs",
      "Explore new consulting service offerings",
      "Review software subscription costs for optimization",
    ],
    riskFactors: ["Increasing competition in software market", "Rising operational costs", "Dependency on key clients"],
    opportunities: [
      "Growing demand for cloud solutions",
      "Potential for international expansion",
      "Cross-selling opportunities in existing client base",
      "Emerging markets in AI and automation",
    ],
  },
}

