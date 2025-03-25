import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Support - Axento Books",
  description: "Get help and support for Axento Books",
}

export default function SupportPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Support Center</h1>
        <p className="text-muted-foreground">Get help with your Axento Books account</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>Get in touch with our support team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Mail className="h-5 w-5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">support@axentobooks.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="h-5 w-5" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-5 w-5" />
              <div>
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-muted-foreground">Available 24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
            <CardDescription>Frequently asked questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">How do I reset my password?</h3>
              <p className="text-sm text-muted-foreground">Go to the login page and click "Forgot Password" to reset your password.</p>
            </div>
            <div>
              <h3 className="font-medium">How do I update my billing information?</h3>
              <p className="text-sm text-muted-foreground">Navigate to Settings &gt; Billing to update your payment methods and billing details.</p>
            </div>
            <div>
              <h3 className="font-medium">How do I export my data?</h3>
              <p className="text-sm text-muted-foreground">Go to Settings &gt; Data to export your account data in various formats.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit a Ticket</CardTitle>
          <CardDescription>Create a support ticket for specific issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Create Support Ticket</Button>
        </CardContent>
      </Card>
    </div>
  )
} 