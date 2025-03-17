"use client"

import type React from "react"

import { useState } from "react"
import { Lock, Mail, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function SecurityForm() {
  const { toast } = useToast()
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    })
    setIsChangingPassword(false)
  }

  const handleEnableMFA = () => {
    toast({
      title: "2FA Setup",
      description: "Two-factor authentication setup will be available soon.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password and manage your account security.</CardDescription>
        </CardHeader>
        <CardContent>
          {isChangingPassword ? (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input id="confirm" type="password" />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Update Password</Button>
                <Button type="button" variant="outline" onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Lock className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                </div>
              </div>
              <Button onClick={() => setIsChangingPassword(true)}>Change Password</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Not enabled</p>
              </div>
            </div>
            <Button onClick={handleEnableMFA}>Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Email Addresses</CardTitle>
          <CardDescription>Manage email addresses linked to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Primary Email</p>
                  <p className="text-sm text-muted-foreground">john@example.com</p>
                </div>
              </div>
              <Button variant="outline" disabled>
                Primary
              </Button>
            </div>
            <Button className="w-full" variant="outline">
              Add Email Address
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

