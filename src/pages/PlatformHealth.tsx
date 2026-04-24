import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  ActivityIcon,
  CpuIcon,
  ClockIcon,
  TrendingUpIcon,
  ServerIcon
} from "lucide-react"

// Mock data for demonstration
const systemStatus = {
  overall: "healthy",
  services: [
    { name: "API Gateway", status: "healthy", uptime: "99.9%" },
    { name: "Database Cluster", status: "healthy", uptime: "99.8%" },
    { name: "Compute Nodes", status: "warning", uptime: "98.2%" },
    { name: "Storage Systems", status: "healthy", uptime: "99.9%" },
  ]
}

const workflowMetrics = {
  activeWorkflows: 247,
  completedToday: 1823,
  averageRuntime: "4.2 min",
  successRate: "97.3%"
}

const resourceMetrics = {
  cpu: { current: 68, trend: "up" },
  memory: { current: 72, trend: "stable" },
  storage: { current: 45, trend: "down" },
  network: { current: 34, trend: "up" }
}

export function PlatformHealth() {
  return (
    <div className="p-6 space-y-6">
      {/* System Status Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <ServerIcon className="size-5" />
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStatus.services.map((service) => (
            <Card key={service.name}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
                  {service.status === "healthy" ? (
                    <CheckCircleIcon className="size-4 text-green-500" />
                  ) : (
                    <AlertTriangleIcon className="size-4 text-yellow-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <Badge variant={service.status === "healthy" ? "default" : "secondary"}>
                    {service.status === "healthy" ? "Healthy" : "Warning"}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Uptime: {service.uptime}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Rates Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <ActivityIcon className="size-5" />
          Workflow Rates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Workflows</CardDescription>
              <CardTitle className="text-2xl">{workflowMetrics.activeWorkflows}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ClockIcon className="size-3" />
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed Today</CardDescription>
              <CardTitle className="text-2xl">{workflowMetrics.completedToday}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircleIcon className="size-3" />
                Successfully finished
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Runtime</CardDescription>
              <CardTitle className="text-2xl">{workflowMetrics.averageRuntime}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ClockIcon className="size-3" />
                Per workflow
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Success Rate</CardDescription>
              <CardTitle className="text-2xl text-green-600">{workflowMetrics.successRate}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUpIcon className="size-3" />
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resource Utilization Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <CpuIcon className="size-5" />
          Resource Utilization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(resourceMetrics).map(([resource, data]) => (
            <Card key={resource}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="capitalize">{resource}</CardDescription>
                  <div className="flex items-center gap-1">
                    {data.trend === "up" && <TrendingUpIcon className="size-3 text-red-500" />}
                    {data.trend === "down" && <TrendingUpIcon className="size-3 text-green-500 rotate-180" />}
                    {data.trend === "stable" && <div className="size-3 bg-gray-400 rounded-full" />}
                  </div>
                </div>
                <CardTitle className="text-2xl">{data.current}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      data.current > 80 ? 'bg-red-500' :
                      data.current > 60 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${data.current}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}