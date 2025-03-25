import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone, Building2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Profile - Axento Books",
  description: "Manage your profile information and settings",
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your profile information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">John Doe</h3>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail className="h-5 w-5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">john.doe@example.com</p>
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
                <MapPin className="h-5 w-5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">New York, USA</p>
                </div>
              </div>
            </div>

            <Button>Edit Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Your business details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8" />
              <div>
                <h3 className="text-lg font-medium">ASTA Inc.</h3>
                <p className="text-sm text-muted-foreground">Enterprise Plan</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium">Business Type</p>
                <p className="text-sm text-muted-foreground">Technology</p>
              </div>
              <div>
                <p className="font-medium">Industry</p>
                <p className="text-sm text-muted-foreground">Software Development</p>
              </div>
              <div>
                <p className="font-medium">Registration Date</p>
                <p className="text-sm text-muted-foreground">January 1, 2024</p>
              </div>
            </div>

            <Button variant="outline">View Business Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 