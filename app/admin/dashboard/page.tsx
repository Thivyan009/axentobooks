"use client"

import { useState } from "react"
import {
  Users,
  Settings,
  Shield,
  Activity,
  Database,
  LogOut,
  Menu,
  Bell,
  Search,
  UserPlus,
  Key,
  AlertTriangle,
  BarChart3,
  FileText,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for larger screens */}
      <aside className="hidden w-64 border-r bg-muted/40 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <span className="flex items-center gap-2 font-semibold">
              <Shield className="h-6 w-6" />
              Super Admin Portal
            </span>
          </div>
          <nav className="flex-1 space-y-1 p-2">
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/admin/dashboard">
                <Activity className="h-4 w-4" />
                Overview
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/admin/users">
                <Users className="h-4 w-4" />
                User Management
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/admin/roles">
                <Key className="h-4 w-4" />
                Role Management
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/admin/logs">
                <Database className="h-4 w-4" />
                System Logs
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/admin/security">
                <AlertTriangle className="h-4 w-4" />
                Security
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/admin/settings">
                <Settings className="h-4 w-4" />
                System Settings
              </Link>
            </Button>
          </nav>
          <div className="border-t p-4">
            <div className="mb-4 rounded-md bg-muted p-3">
              <p className="text-sm font-medium">Logged in as</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          {/* Same content as desktop sidebar */}
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">Super Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8" />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-4 p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">Current active users</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Healthy</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.02%</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList>
              <TabsTrigger value="activity">System Activity</TabsTrigger>
              <TabsTrigger value="users">Recent Users</TabsTrigger>
              <TabsTrigger value="security">Security Alerts</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent System Activity</CardTitle>
                  <CardDescription>Monitor system-wide activities and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2024-03-30 10:45:23</TableCell>
                        <TableCell>admin@example.com</TableCell>
                        <TableCell>User role updated</TableCell>
                        <TableCell>
                          <Badge variant="success">Success</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2024-03-30 10:42:15</TableCell>
                        <TableCell>system</TableCell>
                        <TableCell>Database backup</TableCell>
                        <TableCell>
                          <Badge variant="success">Success</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2024-03-30 10:40:01</TableCell>
                        <TableCell>user@example.com</TableCell>
                        <TableCell>Failed login attempt</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Failed</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Registrations</CardTitle>
                  <CardDescription>New users who have joined the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>john@example.com</TableCell>
                        <TableCell>
                          <Badge>User</Badge>
                        </TableCell>
                        <TableCell>2024-03-30</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>jane@example.com</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Admin</Badge>
                        </TableCell>
                        <TableCell>2024-03-29</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Alerts</CardTitle>
                  <CardDescription>Recent security-related events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2024-03-30 10:30:15</TableCell>
                        <TableCell>Multiple failed login attempts</TableCell>
                        <TableCell>
                          <Badge variant="destructive">High</Badge>
                        </TableCell>
                        <TableCell>Resolved</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2024-03-30 09:15:42</TableCell>
                        <TableCell>Unusual API activity</TableCell>
                        <TableCell>
                          <Badge variant="warning">Medium</Badge>
                        </TableCell>
                        <TableCell>Investigating</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" className="justify-start gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create New User
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Key className="h-4 w-4" />
                  Manage Roles
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  Send Announcement
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Reports
                </Button>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">CPU Usage</div>
                      <div className="text-sm text-muted-foreground">45%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[45%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Memory Usage</div>
                      <div className="text-sm text-muted-foreground">62%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[62%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Disk Usage</div>
                      <div className="text-sm text-muted-foreground">28%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[28%] rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
} 