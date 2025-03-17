import { FileText } from "lucide-react"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Overview",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Transactions",
      href: "/dashboard/transactions",
      icon: "transactions",
    },
    {
      title: "Bank Statements",
      href: "/dashboard/bank-statements",
      icon: "fileText",
    },
    {
      title: "Assets",
      href: "/dashboard/assets",
      icon: "assets",
    },
    {
      title: "Liabilities",
      href: "/dashboard/liabilities",
      icon: "liabilities",
    },
    {
      title: "Equity",
      href: "/dashboard/equity",
      icon: "equity",
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: "reports",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
} 