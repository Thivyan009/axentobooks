import type { SavedReport } from "../types/reports"

export const mockReports: SavedReport[] = [
  {
    id: "1",
    type: "pl",
    name: "January 2024 P&L",
    date: "2024-01-31",
    data: {
      periodStart: "2024-01-01",
      periodEnd: "2024-01-31",
      revenue: [
        {
          category: "Sales Revenue",
          amount: 150000,
          items: [
            { description: "Product Sales", amount: 100000 },
            { description: "Service Revenue", amount: 50000 },
          ],
        },
        {
          category: "Other Income",
          amount: 15000,
          items: [
            { description: "Interest Income", amount: 5000 },
            { description: "Rental Income", amount: 10000 },
          ],
        },
      ],
      expenses: [
        {
          category: "Operating Expenses",
          amount: 85000,
          items: [
            { description: "Salaries", amount: 45000 },
            { description: "Rent", amount: 15000 },
            { description: "Utilities", amount: 10000 },
            { description: "Office Supplies", amount: 5000 },
            { description: "Marketing", amount: 10000 },
          ],
        },
        {
          category: "Administrative Expenses",
          amount: 25000,
          items: [
            { description: "Insurance", amount: 10000 },
            { description: "Professional Fees", amount: 15000 },
          ],
        },
      ],
      summary: {
        totalRevenue: 165000,
        totalExpenses: 110000,
        netProfitLoss: 55000,
        profitMargin: 33.33,
        monthOverMonthGrowth: 8.5,
      },
      analysis: {
        insights: [
          "Strong revenue growth in product sales",
          "Healthy profit margin above industry average",
          "Operating expenses well controlled",
        ],
        recommendations: [
          "Consider expanding product line",
          "Invest in marketing automation",
          "Review utility costs for potential savings",
        ],
        riskFactors: ["Market competition increasing", "Rising operational costs"],
        opportunities: [
          "New market segments identified",
          "Potential for service expansion",
          "E-commerce growth potential",
        ],
      },
    },
  },
  {
    id: "2",
    type: "pl",
    name: "February 2024 P&L",
    date: "2024-02-29",
    data: {
      periodStart: "2024-02-01",
      periodEnd: "2024-02-29",
      revenue: [
        {
          category: "Sales Revenue",
          amount: 180000,
          items: [
            { description: "Product Sales", amount: 120000 },
            { description: "Service Revenue", amount: 60000 },
          ],
        },
        {
          category: "Other Income",
          amount: 20000,
          items: [
            { description: "Interest Income", amount: 8000 },
            { description: "Rental Income", amount: 12000 },
          ],
        },
      ],
      expenses: [
        {
          category: "Operating Expenses",
          amount: 95000,
          items: [
            { description: "Salaries", amount: 50000 },
            { description: "Rent", amount: 15000 },
            { description: "Utilities", amount: 12000 },
            { description: "Office Supplies", amount: 8000 },
            { description: "Marketing", amount: 10000 },
          ],
        },
        {
          category: "Administrative Expenses",
          amount: 30000,
          items: [
            { description: "Insurance", amount: 12000 },
            { description: "Professional Fees", amount: 18000 },
          ],
        },
      ],
      summary: {
        totalRevenue: 200000,
        totalExpenses: 125000,
        netProfitLoss: 75000,
        profitMargin: 37.5,
        monthOverMonthGrowth: 36.36,
      },
      analysis: {
        insights: ["Significant increase in service revenue", "Improved profit margin", "Effective cost management"],
        recommendations: [
          "Scale service operations",
          "Implement customer loyalty program",
          "Optimize resource allocation",
        ],
        riskFactors: ["Supply chain constraints", "Labor market pressure"],
        opportunities: ["Digital transformation initiatives", "Strategic partnerships", "Geographic expansion"],
      },
    },
  },
  {
    id: "3",
    type: "balance",
    name: "Q1 2024 Balance Sheet",
    date: "2024-03-31",
    data: {
      date: "2024-03-31",
      assets: [
        {
          category: "Current Assets",
          amount: 350000,
          items: [
            { description: "Cash and Cash Equivalents", amount: 150000 },
            { description: "Accounts Receivable", amount: 100000 },
            { description: "Inventory", amount: 80000 },
            { description: "Prepaid Expenses", amount: 20000 },
          ],
        },
        {
          category: "Fixed Assets",
          amount: 650000,
          items: [
            { description: "Property and Equipment", amount: 500000 },
            { description: "Vehicles", amount: 100000 },
            { description: "Office Equipment", amount: 50000 },
          ],
        },
      ],
      liabilities: [
        {
          category: "Current Liabilities",
          amount: 180000,
          items: [
            { description: "Accounts Payable", amount: 80000 },
            { description: "Short-term Loans", amount: 60000 },
            { description: "Accrued Expenses", amount: 40000 },
          ],
        },
        {
          category: "Long-term Liabilities",
          amount: 400000,
          items: [
            { description: "Long-term Debt", amount: 300000 },
            { description: "Equipment Financing", amount: 100000 },
          ],
        },
      ],
      equity: [
        {
          category: "Shareholders Equity",
          amount: 420000,
          items: [
            { description: "Common Stock", amount: 200000 },
            { description: "Retained Earnings", amount: 220000 },
          ],
        },
      ],
      summary: {
        totalAssets: 1000000,
        totalLiabilities: 580000,
        totalEquity: 420000,
        currentRatio: 1.94,
        debtToEquityRatio: 1.38,
      },
      analysis: {
        insights: ["Strong asset base with good liquidity", "Healthy current ratio", "Balanced capital structure"],
        recommendations: [
          "Consider debt restructuring opportunities",
          "Optimize working capital management",
          "Review investment in fixed assets",
        ],
        riskFactors: ["Slightly elevated debt-to-equity ratio", "Concentration in fixed assets"],
      },
    },
  },
  {
    id: "4",
    type: "balance",
    name: "Q2 2024 Balance Sheet",
    date: "2024-06-30",
    data: {
      date: "2024-06-30",
      assets: [
        {
          category: "Current Assets",
          amount: 400000,
          items: [
            { description: "Cash and Cash Equivalents", amount: 180000 },
            { description: "Accounts Receivable", amount: 120000 },
            { description: "Inventory", amount: 75000 },
            { description: "Prepaid Expenses", amount: 25000 },
          ],
        },
        {
          category: "Fixed Assets",
          amount: 700000,
          items: [
            { description: "Property and Equipment", amount: 520000 },
            { description: "Vehicles", amount: 120000 },
            { description: "Office Equipment", amount: 60000 },
          ],
        },
      ],
      liabilities: [
        {
          category: "Current Liabilities",
          amount: 200000,
          items: [
            { description: "Accounts Payable", amount: 90000 },
            { description: "Short-term Loans", amount: 70000 },
            { description: "Accrued Expenses", amount: 40000 },
          ],
        },
        {
          category: "Long-term Liabilities",
          amount: 450000,
          items: [
            { description: "Long-term Debt", amount: 350000 },
            { description: "Equipment Financing", amount: 100000 },
          ],
        },
      ],
      equity: [
        {
          category: "Shareholders Equity",
          amount: 450000,
          items: [
            { description: "Common Stock", amount: 200000 },
            { description: "Retained Earnings", amount: 250000 },
          ],
        },
      ],
      summary: {
        totalAssets: 1100000,
        totalLiabilities: 650000,
        totalEquity: 450000,
        currentRatio: 2.0,
        debtToEquityRatio: 1.44,
      },
      analysis: {
        insights: ["Improved current ratio", "Growth in total assets", "Increased retained earnings"],
        recommendations: [
          "Consider equity financing for expansion",
          "Implement inventory optimization",
          "Review credit policies",
        ],
        riskFactors: ["Increasing debt levels", "Working capital management"],
      },
    },
  },
]

