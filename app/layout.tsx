import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { Header } from "@/components/header"
import GoogleAnalytics from "@/components/analytics/google-analytics"
import "@/styles/globals.css"
import { CurrencyProvider } from '@/components/providers/currency-provider'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Axento Books",
  description: "Your personal bookkeeping assistant",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleAnalytics />
        <CurrencyProvider>
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </Providers>
        </CurrencyProvider>
      </body>
    </html>
  )
}