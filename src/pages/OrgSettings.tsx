import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface OrgSettingsProps {
  onNavigate?: (url: string) => void
}

const ssoProviders = [
  {
    id: "1",
    name: "WorkOS",
    type: "SAML 2.0",
    status: "Active",
    users: 247,
    lastSync: "Dec 26, 2024 at 3:45 PM"
  },
  {
    id: "2",
    name: "Okta",
    type: "OIDC",
    status: "Inactive",
    users: 0,
    lastSync: "Never"
  }
]

export function OrgSettings({ onNavigate }: OrgSettingsProps = {}) {
  const [orgData, setOrgData] = React.useState({
    name: "Acme Corp",
    subdomain: "acme-corp",
    allowSelfSignup: false,
    requireMfa: true,
    sessionTimeout: "8",
    defaultRole: "viewer"
  })

  return (
    <div className="p-4 space-y-6 max-w-4xl">
      {/* Organization Details */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Basic information about your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                value={orgData.name}
                onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <Input
                id="subdomain"
                value={orgData.subdomain}
                onChange={(e) => setOrgData({ ...orgData, subdomain: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Access</CardTitle>
          <CardDescription>
            Configure security policies and access controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Allow Self-Signup</div>
              <div className="text-sm text-muted-foreground">
                Let users create accounts without invitation
              </div>
            </div>
            <Switch
              checked={orgData.allowSelfSignup}
              onCheckedChange={(checked) => setOrgData({ ...orgData, allowSelfSignup: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Require Multi-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">
                Require MFA for all users in this organization
              </div>
            </div>
            <Switch
              checked={orgData.requireMfa}
              onCheckedChange={(checked) => setOrgData({ ...orgData, requireMfa: checked })}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={orgData.sessionTimeout}
                onChange={(e) => setOrgData({ ...orgData, sessionTimeout: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultRole">Default Role for New Users</Label>
              <select
                id="defaultRole"
                value={orgData.defaultRole}
                onChange={(e) => setOrgData({ ...orgData, defaultRole: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SSO Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Single Sign-On (SSO)</CardTitle>
              <CardDescription>
                Manage identity providers for your organization
              </CardDescription>
            </div>
            <Button>Add Provider</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ssoProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.name}</TableCell>
                  <TableCell>{provider.type}</TableCell>
                  <TableCell>
                    <Badge variant={provider.status === "Active" ? "default" : "secondary"}>
                      {provider.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{provider.users}</TableCell>
                  <TableCell>{provider.lastSync}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Configure</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Billing & Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Usage & Billing</CardTitle>
          <CardDescription>
            Current usage and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-2xl font-bold">247</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">1.2TB</div>
              <div className="text-sm text-muted-foreground">Storage Used</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">$2,450</div>
              <div className="text-sm text-muted-foreground">Monthly Cost</div>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline">View Detailed Billing</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}