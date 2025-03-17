import Link from "next/link"
import { ArrowLeft, FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="relative mb-4">
          <div className="absolute -inset-1 rounded-full bg-primary/20 blur" />
          <div className="relative rounded-full border bg-muted p-4">
            <FileQuestion className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Page not found</h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            We couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/support">Contact Support</Link>
          </Button>
        </div>
      </div>
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>Error Code: 404</p>
      </div>
    </div>
  )
}

