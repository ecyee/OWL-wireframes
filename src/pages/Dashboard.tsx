import * as React from "react"
import { NewUserWidget } from "@/components/NewUserWidget"
import { AddComputeDrawer } from "@/components/AddComputeDrawer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardProps {
  onNavigate?: (url: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps = {}) {
  const [showNewUserWidget, setShowNewUserWidget] = React.useState(true)
  const [computeDrawerOpen, setComputeDrawerOpen] = React.useState(false)
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
                  <p className="text-2xl font-semibold text-muted-foreground">1</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Policies</p>
                  <p className="text-2xl font-semibold text-muted-foreground">0</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Environments</p>
                  <p className="text-2xl font-semibold text-muted-foreground">0</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Perimeters</p>
                  <p className="text-2xl font-semibold text-muted-foreground">1</p>
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
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3">
                    <div className="w-6 h-6 rounded bg-muted-foreground/20"></div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">No recent activity</p>
                  <p className="text-xs text-muted-foreground">Activity will appear here as you use the platform</p>
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
                    <span className="text-xs text-muted-foreground">45ms avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-xs text-muted-foreground">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <span className="text-xs text-green-600 font-medium">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage</span>
                    <span className="text-xs text-muted-foreground">2% used</span>
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
                <button
                  className="text-left text-sm p-3 rounded border hover:bg-muted transition-colors"
                  onClick={() => onNavigate?.("/security-policy/policies")}
                >
                  <div className="font-medium">Create Policy</div>
                  <div className="text-xs text-muted-foreground mt-1">Set up access controls</div>
                </button>
                <button
                  className="text-left text-sm p-3 rounded border hover:bg-muted transition-colors"
                  onClick={() => onNavigate?.("/identity-access/identities")}
                >
                  <div className="font-medium">Invite Team Member</div>
                  <div className="text-xs text-muted-foreground mt-1">Add admin users</div>
                </button>
                <button
                  className="text-left text-sm p-3 rounded border hover:bg-muted transition-colors"
                  onClick={() => setComputeDrawerOpen(true)}
                >
                  <div className="font-medium">Add Compute</div>
                  <div className="text-xs text-muted-foreground mt-1">Set up compute pools</div>
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
              onOpenComputeDrawer={() => setComputeDrawerOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Add Compute Drawer */}
      <AddComputeDrawer
        open={computeDrawerOpen}
        onOpenChange={setComputeDrawerOpen}
      />
    </div>
  )
}