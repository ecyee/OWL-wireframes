import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface NotificationsProps {
  onNavigate?: (url: string) => void
}

export function Notifications({ onNavigate }: NotificationsProps = {}) {
  const [eventTypes, setEventTypes] = React.useState({
    vulnerabilityAlerts: true,
    policyViolations: false,
    accessAndProvisioning: false,
    usageAndCompute: true,
    auditLogSummaries: false,
  })

  const [thresholds, setThresholds] = React.useState({
    vulnerabilityAlerts: { severity: "high" },
    usageAndCompute: { cpuThreshold: "80", costThreshold: "1000" },
    auditLogSummaries: { frequency: "daily" }
  })

  const toggleEventType = (type: keyof typeof eventTypes) => {
    setEventTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      {/* Event Types Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Event Types</h2>

        <div className="space-y-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Vulnerability Alerts</span>
              <Switch
                checked={eventTypes.vulnerabilityAlerts}
                onCheckedChange={() => toggleEventType('vulnerabilityAlerts')}
              />
            </div>
            {eventTypes.vulnerabilityAlerts && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Minimum Severity</Label>
                  <Select value={thresholds.vulnerabilityAlerts.severity} onValueChange={(value) =>
                    setThresholds(prev => ({
                      ...prev,
                      vulnerabilityAlerts: { ...prev.vulnerabilityAlerts, severity: value }
                    }))
                  }>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Policy Violations</span>
              <Switch
                checked={eventTypes.policyViolations}
                onCheckedChange={() => toggleEventType('policyViolations')}
              />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Access and provisioning events</span>
              <Switch
                checked={eventTypes.accessAndProvisioning}
                onCheckedChange={() => toggleEventType('accessAndProvisioning')}
              />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Usage and compute thresholds</span>
              <Switch
                checked={eventTypes.usageAndCompute}
                onCheckedChange={() => toggleEventType('usageAndCompute')}
              />
            </div>
            {eventTypes.usageAndCompute && (
              <div className="mt-4 pt-4 border-t space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">CPU Usage Threshold (%)</Label>
                    <Input
                      type="number"
                      value={thresholds.usageAndCompute.cpuThreshold}
                      onChange={(e) =>
                        setThresholds(prev => ({
                          ...prev,
                          usageAndCompute: { ...prev.usageAndCompute, cpuThreshold: e.target.value }
                        }))
                      }
                      placeholder="80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Monthly Cost Threshold ($)</Label>
                    <Input
                      type="number"
                      value={thresholds.usageAndCompute.costThreshold}
                      onChange={(e) =>
                        setThresholds(prev => ({
                          ...prev,
                          usageAndCompute: { ...prev.usageAndCompute, costThreshold: e.target.value }
                        }))
                      }
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Audit log summaries</span>
              <Switch
                checked={eventTypes.auditLogSummaries}
                onCheckedChange={() => toggleEventType('auditLogSummaries')}
              />
            </div>
            {eventTypes.auditLogSummaries && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Summary Frequency</Label>
                  <Select value={thresholds.auditLogSummaries.frequency} onValueChange={(value) =>
                    setThresholds(prev => ({
                      ...prev,
                      auditLogSummaries: { ...prev.auditLogSummaries, frequency: value }
                    }))
                  }>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Delivery Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Delivery</h2>

        <div className="space-y-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Email</span>
              <span className="text-muted-foreground">example@email.com</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Frequency</span>
              <span className="text-muted-foreground">--</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}