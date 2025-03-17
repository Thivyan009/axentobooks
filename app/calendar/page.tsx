import { PageLayout } from "@/components/layouts/page-layout"
import { TransactionCalendar } from "@/components/calendar/transaction-calendar"

export default function CalendarPage() {
  return (
    <PageLayout 
      title="Transaction Calendar" 
      description="View and manage your transactions by date"
    >
      <div className="p-8">
        <TransactionCalendar />
      </div>
    </PageLayout>
  )
} 