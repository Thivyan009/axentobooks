"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = {
  general: {
    name: "General",
    description: "Basic information about Axento Books",
    questions: [
      {
        id: "what-is-axento",
        question: "What is Axento Books?",
        answer: "Axento Books is a modern bookkeeping software designed to help businesses manage their financial records efficiently. It provides features for tracking transactions, generating reports, and maintaining accurate financial records."
      },
      {
        id: "getting-started",
        question: "How do I get started with Axento Books?",
        answer: "Getting started is easy! After signing up, you'll be guided through our onboarding process where you can set up your business profile, connect your accounts, and customize your preferences. Our step-by-step tutorial will help you understand all the essential features."
      },
      {
        id: "data-security",
        question: "Is my data secure?",
        answer: "Yes, we take security seriously. All data is encrypted both in transit and at rest. We use industry-standard security protocols and regularly perform security audits to ensure your financial information remains protected."
      }
    ]
  },
  transactions: {
    name: "Transactions",
    description: "Managing your financial transactions",
    questions: [
      {
        id: "add-transaction",
        question: "How do I add a new transaction?",
        answer: "To add a new transaction, click the '+ New Transaction' button in the transactions page. Fill in the required details such as date, amount, category, and description. You can also attach receipts and add notes for better record-keeping."
      },
      {
        id: "import-transactions",
        question: "Can I import transactions from my bank?",
        answer: "Yes, you can import transactions directly from your bank through our secure bank integration feature. We support most major banks and financial institutions. You can also import transactions using CSV files."
      },
      {
        id: "categorize-transactions",
        question: "How do I categorize transactions?",
        answer: "You can categorize transactions manually or set up automatic categorization rules. Our AI-powered system learns from your categorization patterns to suggest categories for new transactions automatically."
      },
      {
        id: "bulk-edit",
        question: "Can I edit multiple transactions at once?",
        answer: "Yes, you can use our bulk edit feature to modify multiple transactions simultaneously. Select the transactions you want to edit, then use the bulk actions menu to update categories, add tags, or make other changes."
      }
    ]
  },
  reports: {
    name: "Reports & Analytics",
    description: "Understanding your financial reports",
    questions: [
      {
        id: "report-types",
        question: "What types of reports are available?",
        answer: "We offer various reports including Profit & Loss, Balance Sheet, Cash Flow Statement, Tax Summary, and custom reports. You can customize the date range and filters for each report to get exactly the information you need."
      },
      {
        id: "export-reports",
        question: "Can I export reports?",
        answer: "Yes, all reports can be exported in multiple formats including PDF, Excel, and CSV. You can also schedule regular report exports to be sent to your email automatically."
      },
      {
        id: "report-updates",
        question: "How often are reports updated?",
        answer: "Reports are updated in real-time as you add or modify transactions. You can always see the most current financial status of your business."
      }
    ]
  },
  billing: {
    name: "Billing & Subscriptions",
    description: "Managing your subscription and payments",
    questions: [
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and bank transfers. For annual subscriptions, we also offer additional payment options. Contact our support team for more information."
      },
      {
        id: "change-plan",
        question: "Can I change my subscription plan?",
        answer: "Yes, you can upgrade or downgrade your subscription plan at any time. Changes will be prorated and reflected in your next billing cycle."
      },
      {
        id: "refunds",
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee for new subscriptions. If you're not satisfied with our service, contact our support team within the first 30 days for a full refund."
      }
    ]
  },
  integrations: {
    name: "Integrations",
    description: "Connecting with other services",
    questions: [
      {
        id: "available-integrations",
        question: "What integrations are available?",
        answer: "We integrate with popular accounting software, payment processors, and banking institutions. Some of our key integrations include QuickBooks, Xero, Stripe, PayPal, and major banks worldwide."
      },
      {
        id: "setup-integration",
        question: "How do I set up an integration?",
        answer: "Go to Settings > Integrations, choose the service you want to connect, and follow the step-by-step instructions. Most integrations can be set up in just a few minutes."
      },
      {
        id: "sync-frequency",
        question: "How often do integrations sync?",
        answer: "Most integrations sync automatically every few hours, but you can also trigger manual syncs when needed. The exact frequency depends on the integration and your subscription plan."
      }
    ]
  },
  security: {
    name: "Security & Privacy",
    description: "Protecting your data",
    questions: [
      {
        id: "data-encryption",
        question: "How is my data encrypted?",
        answer: "We use industry-standard encryption protocols (AES-256) for data at rest and TLS 1.3 for data in transit. All sensitive information is encrypted before being stored in our secure databases."
      },
      {
        id: "backup-policy",
        question: "What is your backup policy?",
        answer: "We perform automated backups multiple times daily and store them in geographically distributed locations. Your data is backed up incrementally every hour and full backups are created daily."
      },
      {
        id: "access-control",
        question: "How can I control user access?",
        answer: "You can set up role-based access control (RBAC) to define what each team member can view and modify. We also support two-factor authentication and single sign-on (SSO) for enhanced security."
      }
    ]
  }
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("general")

  const filteredQuestions = React.useMemo(() => {
    if (!searchQuery) return faqs[selectedCategory].questions

    const query = searchQuery.toLowerCase()
    return faqs[selectedCategory].questions.filter(
      faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    )
  }, [searchQuery, selectedCategory])

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Help Center</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions or contact our support team
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <nav className="flex flex-row overflow-x-auto lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 p-1 -mx-1">
                {Object.entries(faqs).map(([key, category]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedCategory(key)}
                    className={`flex-shrink-0 w-auto lg:w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                      selectedCategory === key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="space-y-8">
              <div className="relative max-w-2xl">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  className="pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-3">
                  {faqs[selectedCategory].name}
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  {faqs[selectedCategory].description}
                </p>

                <div className="bg-card rounded-lg border shadow-sm">
                  <Accordion type="single" collapsible className="w-full">
                    {filteredQuestions.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-1">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {filteredQuestions.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No questions found matching your search.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border bg-muted/50 p-8">
                <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
                <p className="text-muted-foreground mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <a
                  href="/support"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 