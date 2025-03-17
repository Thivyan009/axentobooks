import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ReportNotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Report Not Found</h2>
      <p className="text-muted-foreground mb-6">The report you're looking for doesn't exist or has been removed.</p>
      <Link href="/reports">
        <Button>Return to Reports</Button>
      </Link>
    </div>
  )
}

