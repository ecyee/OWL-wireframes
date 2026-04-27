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
import { LinkIcon, CircleIcon, FileTextIcon, CheckSquareIcon, TrashIcon, CopyIcon, LockIcon, UnlockIcon, CpuIcon, MemoryStickIcon, PlusIcon } from "lucide-react"

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
  { id: "channels", label: "Channels", count: 3 },
  { id: "integrations", label: "Integrations", count: 5 },
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

          {/* Channels Tab Content */}
          {activeTab === "channels" && (
            <div className="space-y-4">
              {/* Add Channel Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter channel name to add to this perimeter"
                  className="flex-1"
                />
                <Button>
                  Add Channel
                </Button>
              </div>

              {/* Channels Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Channel Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Packages</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <code className="font-mono text-sm">conda-forge</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Public</Badge>
                      </TableCell>
                      <TableCell>1,250</TableCell>
                      <TableCell>Apr 27, 2026</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <TrashIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <code className="font-mono text-sm">anaconda-main</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Private</Badge>
                      </TableCell>
                      <TableCell>850</TableCell>
                      <TableCell>Apr 27, 2026</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <TrashIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <code className="font-mono text-sm">anaconda-staging</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Private</Badge>
                      </TableCell>
                      <TableCell>423</TableCell>
                      <TableCell>Apr 26, 2026</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <TrashIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Integrations Tab Content */}
          {activeTab === "integrations" && (
            <div className="text-left">
              {/* Integrations Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Integrations</h3>
                    <p className="text-sm text-muted-foreground">
                      API keys and integrations available for this perimeter
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add Integration
                  </Button>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Integration</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-xs font-bold">AI</span>
                            </div>
                            <span className="font-medium">Anthropic</span>
                          </div>
                        </TableCell>
                        <TableCell>AI/LLM</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                        </TableCell>
                        <TableCell>Dec 20, 2024</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <TrashIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-orange-500 rounded"></div>
                            </div>
                            <span className="font-medium">Amazon S3</span>
                          </div>
                        </TableCell>
                        <TableCell>Storage</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                        </TableCell>
                        <TableCell>Dec 18, 2024</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <TrashIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                            </div>
                            <span className="font-medium">OpenAI</span>
                          </div>
                        </TableCell>
                        <TableCell>AI/LLM</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-muted-foreground">Not Connected</Badge>
                        </TableCell>
                        <TableCell>—</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <PlusIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm">🤗</span>
                            </div>
                            <span className="font-medium">Hugging Face</span>
                          </div>
                        </TableCell>
                        <TableCell>AI/ML</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-muted-foreground">Not Connected</Badge>
                        </TableCell>
                        <TableCell>—</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <PlusIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-blue-600 rounded"></div>
                            </div>
                            <span className="font-medium">Postgres</span>
                          </div>
                        </TableCell>
                        <TableCell>Database</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                        </TableCell>
                        <TableCell>Dec 15, 2024</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <TrashIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* Compute Tab Content */}
          {activeTab === "compute" && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Compute content coming soon.</p>
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

              {/* Compute Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Compute</h3>
                    <p className="text-sm text-muted-foreground">
                      Compute resource limits and allocation for this perimeter
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <LockIcon className="w-4 h-4" />
                      <span>Enforced</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <div>
                    <div className="font-medium text-sm">Resource Limits Policy</div>
                    <div className="text-xs text-muted-foreground">Max 2 vCPUs, 8 GB memory per task. GPU access enabled for ML workloads.</div>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Security</h3>
                    <p className="text-sm text-muted-foreground">
                      IAM management, default ARN role, and group mappings for this perimeter
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <LockIcon className="w-4 h-4" />
                      <span>Enforced</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">IAM Configuration</div>
                      <div className="text-xs text-muted-foreground mb-2">Default ARN role: arn:aws:iam::851212891889:role/obp-0ttxc8-task</div>
                      <div className="text-xs text-muted-foreground">Mapped groups: Data Science Team, Platform Admins (324 users total)</div>
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