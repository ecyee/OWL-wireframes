import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LinkIcon, CircleIcon, FileTextIcon, CheckSquareIcon, TrashIcon, CopyIcon, LockIcon, UnlockIcon, CpuIcon, MemoryStickIcon } from "lucide-react"

interface PerimetersProps {
  onNavigate?: (url: string) => void
}

// Mock data for perimeters
const perimeters = [
  { id: "default", name: "Default" },
  { id: "staging", name: "Staging" },
]

const perimeterData = {
  default: {
    name: "Default",
    roleArn: "arn:aws:iam::851212891889:role/obp-0ttxc8-task",
    computePools: [
      "dep-inf", "dep-inf-large", "nebius-test", "obp-inference",
      "obp-tasks", "obp-ws", "obp-ws-gpu", "tytest"
    ],
    imageRegistry: "006988687827.dkr.ecr.us-west-2.amazonaws.com",
    defaultResources: {
      vcpus: 2,
      memory: 8,
      maxVcpus: 2,
      maxMemory: 8
    }
  },
  staging: {
    name: "Staging",
    roleArn: "arn:aws:iam::851212891889:role/obp-staging-task",
    computePools: [
      "staging-inf", "staging-large", "staging-gpu"
    ],
    imageRegistry: "006988687827.dkr.ecr.us-west-2.amazonaws.com",
    defaultResources: {
      vcpus: 1,
      memory: 4,
      maxVcpus: 4,
      maxMemory: 16
    }
  }
}

const users = [
  { email: "aalvi@anaconda.com", role: "Execute" },
  { email: "aarif@anaconda.com", role: "Execute" },
  { email: "abaker@anaconda.com", role: "Execute" },
  { email: "abellezza@anaconda.com", role: "Execute" },
  { email: "abolla@anaconda.com", role: "Execute" },
  { email: "abrannen@anaconda.com", role: "Execute" },
  { email: "acuni@anaconda.com", role: "Execute" },
]

const tabs = [
  { id: "humans", label: "Humans", count: 324 },
  { id: "machines", label: "Machines", count: 10 },
  { id: "policies", label: "Policies", count: null },
]

export function Perimeters({ onNavigate }: PerimetersProps = {}) {
  const [selectedPerimeter, setSelectedPerimeter] = React.useState("default")
  const [activeTab, setActiveTab] = React.useState("humans")
  const [userEmail, setUserEmail] = React.useState("")

  const currentPerimeter = perimeterData[selectedPerimeter as keyof typeof perimeterData]

  const handleAddUser = () => {
    if (userEmail) {
      // Handle adding user logic here
      setUserEmail("")
    }
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 p-4">
        <div className="space-y-1">
          {perimeters.map((perimeter) => (
            <button
              key={perimeter.id}
              onClick={() => setSelectedPerimeter(perimeter.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedPerimeter === perimeter.id
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {perimeter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="border rounded-lg bg-card p-4">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold">{currentPerimeter.name}</h1>
          </div>

          {/* Configuration Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <LinkIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">the default role ARN is </span>
                <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                  {currentPerimeter.roleArn}
                </code>
                <span className="text-muted-foreground"> for tasks</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CircleIcon className="w-4 h-4 mt-0.5 text-muted-foreground fill-current" />
              <div className="text-sm">
                <span className="text-muted-foreground">workloads can run in </span>
                {currentPerimeter.computePools.map((pool, index) => (
                  <span key={pool}>
                    <code className="font-mono text-xs text-green-700 bg-green-50 px-1 py-0.5 rounded">
                      {pool}
                    </code>
                    {index < currentPerimeter.computePools.length - 1 && <span className="text-muted-foreground">, </span>}
                  </span>
                ))}
                <span className="text-muted-foreground"> compute pools</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileTextIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">tasks will use the </span>
                <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                  obptask-python:stable
                </code>
                <span className="text-muted-foreground"> image and </span>
                <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                  {currentPerimeter.imageRegistry}
                </code>
                <span className="text-muted-foreground"> registry by default</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckSquareIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">tasks will default to </span>
                <span className="font-medium">{currentPerimeter.defaultResources.vcpus} vCPUs</span>
                <span className="text-muted-foreground"> and </span>
                <span className="font-medium">{currentPerimeter.defaultResources.memory} GBs</span>
                <span className="text-muted-foreground"> of memory and can access at most </span>
                <span className="font-medium">{currentPerimeter.defaultResources.maxVcpus} vCPUs</span>
                <span className="text-muted-foreground"> and </span>
                <span className="font-medium">{currentPerimeter.defaultResources.maxMemory} GBs</span>
                <span className="text-muted-foreground"> of memory.</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs px-2 py-0.5">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Humans Tab Content */}
          {activeTab === "humans" && (
            <div className="space-y-4">
              {/* Add User Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter human user's email to assign them to this perimeter"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddUser} disabled={!userEmail}>
                  Add
                </Button>
              </div>

              {/* Users Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={user.role.toLowerCase()}>
                            <SelectTrigger className="w-32 border-0 shadow-none p-0 h-auto bg-transparent hover:bg-muted">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="execute">Execute</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="read">Read</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <TrashIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Machines Tab Content */}
          {activeTab === "machines" && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Machines content coming soon.</p>
            </div>
          )}

          {/* Policies Tab Content */}
          {activeTab === "policies" && (
            <div className="space-y-8">
              {/* Container Images Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Container Images</h3>
                    <p className="text-sm text-muted-foreground">
                      Recommended container images that may be used to run tasks in this perimeter, via @kubernetes(image="...")
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <LockIcon className="w-4 h-4" />
                      <span>Enforced</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <code className="text-sm font-mono">fast-bakery.merced.obp.outerbounds.com/*</code>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <CopyIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-3">
                      <code className="text-sm font-mono">006988687827.dkr.ecr.us-west-2.amazonaws.com/obptask-python:stable</code>
                      <Badge variant="secondary" className="text-xs">System Image</Badge>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">Default</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <CopyIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>


              {/* Task Resource Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Task Resource</h3>
                    <p className="text-sm text-muted-foreground">
                      Specifies the resource constraints for tasks running in this perimeter
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <UnlockIcon className="w-4 h-4" />
                      <span>Not Enforced</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-md">
                    <CpuIcon className="w-5 h-5 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">CPU</span>
                      <span className="text-lg font-semibold">2</span>
                      <span className="text-sm text-muted-foreground">vCPUs</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-md">
                    <MemoryStickIcon className="w-5 h-5 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Memory</span>
                      <span className="text-lg font-semibold">8</span>
                      <span className="text-sm text-muted-foreground">GB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Channel Policies Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Channels</h3>
                    <p className="text-sm text-muted-foreground">
                      Policies that govern package channels and distribution
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <LockIcon className="w-4 h-4" />
                      <span>2 Enforced</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Production Package Approval</div>
                      <div className="text-xs text-muted-foreground">Requires admin approval for production packages</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Security Vulnerability Blocking</div>
                      <div className="text-xs text-muted-foreground">Prevents packages with high CVE scores</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environment Policies Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Environments</h3>
                    <p className="text-sm text-muted-foreground">
                      Policies for environment configuration and management
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <LockIcon className="w-4 h-4" />
                      <span>3 Enforced</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Resource Usage Limits</div>
                      <div className="text-xs text-muted-foreground">Enforces CPU and memory limits</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Auto-cleanup Idle Environments</div>
                      <div className="text-xs text-muted-foreground">Removes unused environments after 30 days</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Required Security Packages</div>
                      <div className="text-xs text-muted-foreground">Mandates security scanning tools</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Model Policies Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Models</h3>
                    <p className="text-sm text-muted-foreground">
                      Policies governing model deployment and monitoring
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <LockIcon className="w-4 h-4" />
                      <span>3 Enforced</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Data Privacy Compliance</div>
                      <div className="text-xs text-muted-foreground">Ensures GDPR and data privacy compliance</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Production Monitoring</div>
                      <div className="text-xs text-muted-foreground">Mandates performance monitoring and alerting</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Model Performance Benchmarks</div>
                      <div className="text-xs text-muted-foreground">Requires minimum accuracy thresholds</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compute Policies Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Compute</h3>
                    <p className="text-sm text-muted-foreground">
                      Policies for compute resource management and allocation
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <LockIcon className="w-4 h-4" />
                      <span>3 Enforced</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Resource Quotas</div>
                      <div className="text-xs text-muted-foreground">Enforces maximum resource allocation per user/group</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Cost Control Limits</div>
                      <div className="text-xs text-muted-foreground">Sets spending caps and budget alerts</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">GPU Allocation Priority</div>
                      <div className="text-xs text-muted-foreground">Manages GPU resources based on workload priority</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Policies Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Security and access control policies
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <LockIcon className="w-4 h-4" />
                      <span>4 Enforced</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Network Access Control</div>
                      <div className="text-xs text-muted-foreground">Restricts network access and communication patterns</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Data Encryption Standards</div>
                      <div className="text-xs text-muted-foreground">Enforces encryption for data at rest and in transit</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Multi-factor Authentication</div>
                      <div className="text-xs text-muted-foreground">Requires MFA for administrative operations</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">Vulnerability Scanning</div>
                      <div className="text-xs text-muted-foreground">Regular security scans for containers and infrastructure</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Policies Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Integrations</h3>
                    <p className="text-sm text-muted-foreground">
                      Policies for external integrations and API access
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <LockIcon className="w-4 h-4" />
                      <span>2 Enforced</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">API Rate Limiting</div>
                      <div className="text-xs text-muted-foreground">Controls API request rates and implements throttling</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">External Service Approval</div>
                      <div className="text-xs text-muted-foreground">Requires approval for external service integrations</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}