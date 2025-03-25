import { PageLayout } from "@/components/layouts/page-layout"
import { FileSpreadsheet, Sparkles } from "lucide-react"

export default function InvoicesPage() {
  return (
    <PageLayout title="Invoices" description="Manage and create your business invoices">
      <main className="flex-1 flex items-center">
        <div className="container flex flex-col items-center justify-center text-center max-w-[640px] py-8 ml-36 mt-16">
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative bg-background rounded-full p-4 border shadow-lg">
              <FileSpreadsheet className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-lg font-medium">Coming Soon</p>
          </div>
          
          <p className="text-base text-muted-foreground">
            We're crafting a powerful invoice management system to streamline your business operations. Stay tuned for updates!
          </p>
        </div>
      </main>
    </PageLayout>
  )
} 