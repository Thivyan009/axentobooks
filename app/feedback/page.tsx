import { PageLayout } from "@/components/layouts/page-layout"
import { FeedbackForm } from "@/components/feedback/feedback-form"

export default function FeedbackPage() {
  return (
    <PageLayout 
      title="Beta Feedback" 
      description="Help us improve Axento Books by sharing your feedback"
    >
      <div className="container max-w-2xl py-8">
        <div className="rounded-lg border bg-card p-8">
          <div className="mb-8">
            <h2 className="text-lg font-semibold">Share Your Thoughts</h2>
            <p className="text-muted-foreground mt-2">
              We're constantly working to improve Axento Books. Your feedback helps us understand what's working well and what needs improvement.
            </p>
          </div>
          <FeedbackForm />
        </div>
      </div>
    </PageLayout>
  )
} 