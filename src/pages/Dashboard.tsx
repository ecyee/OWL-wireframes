import * as React from "react"
import { NewUserWidget } from "@/components/NewUserWidget"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardProps {
  onNavigate?: (url: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps = {}) {
  const [showNewUserWidget, setShowNewUserWidget] = React.useState(true)
  return (
    <div className="p-3 h-full">
      <div className={cn("grid gap-6 h-full", showNewUserWidget ? "grid-cols-3" : "grid-cols-1")}>
        {/* Main Content Area - Left 2 columns or full width when widget is dismissed */}
        <div className={cn("space-y-6", showNewUserWidget ? "col-span-2" : "col-span-1")}>
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>
                Overview of your organization's activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-semibold">247</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Policies</p>
                  <p className="text-2xl font-semibold">12</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Environments</p>
                  <p className="text-2xl font-semibold">8</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Perimeters</p>
                  <p className="text-2xl font-semibold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Cards Row */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New user invited</span>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Policy updated</span>
                    <span className="text-xs text-muted-foreground">4h ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Environment created</span>
                    <span className="text-xs text-muted-foreground">1d ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Perimeter configured</span>
                    <span className="text-xs text-muted-foreground">2d ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Integration added</span>
                    <span className="text-xs text-muted-foreground">3d ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">All systems</span>
                    <span className="text-xs text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response</span>
                    <span className="text-xs text-muted-foreground">142ms avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-xs text-muted-foreground">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <span className="text-xs text-green-600 font-medium">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage</span>
                    <span className="text-xs text-muted-foreground">73% used</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <button className="text-left text-sm p-3 rounded border hover:bg-muted transition-colors">
                  <div className="font-medium">Create Policy</div>
                  <div className="text-xs text-muted-foreground mt-1">Set up access controls</div>
                </button>
                <button className="text-left text-sm p-3 rounded border hover:bg-muted transition-colors">
                  <div className="font-medium">Invite Team Member</div>
                  <div className="text-xs text-muted-foreground mt-1">Add admin users</div>
                </button>
                <button className="text-left text-sm p-3 rounded border hover:bg-muted transition-colors">
                  <div className="font-medium">View Audit Logs</div>
                  <div className="text-xs text-muted-foreground mt-1">Review activity</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New User Widget - Right column */}
        {showNewUserWidget && (
          <div className="col-span-1">
            <NewUserWidget
              onDismiss={() => setShowNewUserWidget(false)}
              onNavigate={onNavigate}
            />
          </div>
        )}
      </div>
    </div>
  )
}