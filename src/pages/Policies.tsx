import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreatePolicyModal } from "@/components/CreatePolicyModal"
import { MoreHorizontalIcon } from "lucide-react"

interface PoliciesProps {
  onNavigate?: (url: string) => void
}

// Mock data for policies
const channelPolicies = [
  {
    id: "1",
    name: "Production Package Approval",
    description: "Requires admin approval for all packages published to production channels",
    channel: "anaconda-main",
    updated: "Dec 15, 2024 at 2:30 PM",
  },
  {
    id: "2",
    name: "Open Source License Compliance",
    description: "Automatically scans and blocks packages with GPL or AGPL licenses",
    channel: "conda-forge",
    updated: "Dec 12, 2024 at 9:15 AM",
  },
  {
    id: "3",
    name: "Security Vulnerability Blocking",
    description: "Prevents packages with high or critical CVE scores from being published",
    channel: "anaconda-main",
    updated: "Dec 10, 2024 at 4:45 PM",
  },
  {
    id: "4",
    name: "Package Size Limits",
    description: "Enforces maximum package size limits to prevent storage bloat",
    channel: "conda-forge",
    updated: "Dec 8, 2024 at 11:20 AM",
  },
  {
    id: "5",
    name: "Staging Environment Testing",
    description: "Requires successful test runs in staging before production deployment",
    channel: "anaconda-staging",
    updated: "Dec 5, 2024 at 3:10 PM",
  },
  {
    id: "6",
    name: "Dependency Version Pinning",
    description: "Enforces specific version ranges for critical dependencies",
    channel: "conda-forge",
    updated: "Nov 28, 2024 at 1:25 PM",
  },
]

const environmentPolicies = [
  {
    id: "1",
    name: "Resource Usage Limits",
    description: "Enforces CPU and memory limits for environment containers",
    applied: "perimeter: production",
    updated: "Dec 14, 2024 at 11:45 AM",
  },
  {
    id: "2",
    name: "Python Version Compliance",
    description: "Restricts environments to approved Python versions (3.8, 3.9, 3.11)",
    applied: "perimeter: default",
    updated: "Dec 11, 2024 at 8:30 AM",
  },
  {
    id: "3",
    name: "Environment Naming Convention",
    description: "Enforces standardized naming patterns for environment identification",
    applied: "perimeter: production",
    updated: "Dec 9, 2024 at 2:15 PM",
  },
  {
    id: "4",
    name: "Auto-cleanup Idle Environments",
    description: "Automatically removes environments unused for more than 30 days",
    applied: "perimeter: default",
    updated: "Dec 7, 2024 at 4:20 PM",
  },
  {
    id: "5",
    name: "Required Security Packages",
    description: "Mandates inclusion of security scanning tools in all environments",
    applied: "perimeter: production",
    updated: "Dec 3, 2024 at 10:15 AM",
  },
  {
    id: "6",
    name: "Environment Documentation",
    description: "Requires description and usage documentation for all environments",
    applied: "perimeter: default",
    updated: "Nov 30, 2024 at 3:45 PM",
  },
]

const modelPolicies = [
  {
    id: "1",
    name: "Data Privacy Compliance",
    description: "Ensures models comply with GDPR and data privacy regulations",
    applied: "perimeter: production",
    updated: "Dec 13, 2024 at 9:45 AM",
  },
  {
    id: "2",
    name: "Bias Detection and Mitigation",
    description: "Automatically scans models for potential algorithmic bias",
    applied: "perimeter: default",
    updated: "Dec 8, 2024 at 2:10 PM",
  },
  {
    id: "3",
    name: "Production Monitoring",
    description: "Mandates performance monitoring and alerting for deployed models",
    applied: "perimeter: production",
    updated: "Dec 2, 2024 at 11:30 AM",
  },
  {
    id: "4",
    name: "Model Performance Benchmarks",
    description: "Requires minimum accuracy thresholds before model deployment",
    applied: "perimeter: production",
    updated: "Dec 16, 2024 at 1:20 PM",
  },
  {
    id: "5",
    name: "Model Version Control",
    description: "Enforces semantic versioning and change documentation for models",
    applied: "perimeter: default",
    updated: "Dec 10, 2024 at 3:30 PM",
  },
  {
    id: "6",
    name: "Model Size Optimization",
    description: "Limits model size and requires compression for large models",
    applied: "perimeter: default",
    updated: "Dec 5, 2024 at 4:55 PM",
  },
]

const computePolicies = [
  {
    id: "1",
    name: "Resource Limits Policy - Default",
    description: "Max 2 vCPUs, 8 GB memory per task. GPU access enabled for ML workloads.",
    applied: "perimeter: default",
    updated: "Dec 20, 2024 at 3:15 PM",
  },
  {
    id: "2",
    name: "Resource Limits Policy - Production",
    description: "Max 4 vCPUs, 16 GB memory per task. Restricted GPU access for production workloads.",
    applied: "perimeter: production",
    updated: "Dec 18, 2024 at 10:30 AM",
  },
]

const securityPolicies = [
  {
    id: "1",
    name: "IAM Configuration - Default",
    description: "Default ARN role: arn:aws:iam::851212891889:role/obp-0ttxc8-task. Mapped groups: Data Science Team, Platform Admins (324 users total).",
    applied: "perimeter: default",
    updated: "Dec 22, 2024 at 1:30 PM",
  },
  {
    id: "2",
    name: "IAM Configuration - Production",
    description: "Default ARN role: arn:aws:iam::851212891889:role/obp-prod-task. Mapped groups: Platform Admins, Engineering (45 users total).",
    applied: "perimeter: production",
    updated: "Dec 19, 2024 at 9:45 AM",
  },
]

const integrationPolicies = [
  {
    id: "1",
    name: "API Rate Limiting",
    description: "Controls API request rates and implements throttling mechanisms",
    applied: "perimeter: production",
    updated: "Dec 21, 2024 at 10:15 AM",
  },
  {
    id: "2",
    name: "External Service Approval",
    description: "Requires approval for integrations with external services",
    applied: "perimeter: production",
    updated: "Dec 17, 2024 at 2:30 PM",
  },
  {
    id: "3",
    name: "Data Export Controls",
    description: "Governs data export to external systems and services",
    applied: "perimeter: default",
    updated: "Dec 13, 2024 at 11:20 AM",
  },
  {
    id: "4",
    name: "Webhook Security Standards",
    description: "Security requirements for incoming and outgoing webhooks",
    applied: "perimeter: production",
    updated: "Dec 9, 2024 at 3:45 PM",
  },
  {
    id: "5",
    name: "Third-party Authentication",
    description: "Standards for integrating with external authentication providers",
    applied: "perimeter: default",
    updated: "Dec 6, 2024 at 1:15 PM",
  },
]

// Tab navigation
const tabs = [
  { id: "channels", label: "Channels" },
  { id: "environments", label: "Environments" },
  { id: "models", label: "Models" },
  { id: "compute", label: "Compute" },
  { id: "security", label: "Security" },
  { id: "integrations", label: "Integrations" },
]

export function Policies({ onNavigate }: PoliciesProps = {}) {
  const [activeTab, setActiveTab] = React.useState("channels")
  const [createPolicyModalOpen, setCreatePolicyModalOpen] = React.useState(false)

  // Get the appropriate data and title based on active tab
  const getTabContent = () => {
    switch (activeTab) {
      case "channels":
        return { data: channelPolicies, title: "Channel Policies" }
      case "environments":
        return { data: environmentPolicies, title: "Environment Policies" }
      case "models":
        return { data: modelPolicies, title: "Model Policies" }
      case "compute":
        return { data: computePolicies, title: "Compute Policies" }
      case "security":
        return { data: securityPolicies, title: "Security Policies" }
      case "integrations":
        return { data: integrationPolicies, title: "Integration Policies" }
      default:
        return { data: [], title: "Policies" }
    }
  }

  const { data, title } = getTabContent()

  return (
    <div className="p-4 space-y-4">
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>


      {/* Dynamic Policies Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setCreatePolicyModalOpen(true)}
          >
            Create
          </Button>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>{activeTab === "channels" ? "Channel" : "Perimeter"}</TableHead>
                <TableHead className="text-right">Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{policy.name}</div>
                      <div className="text-sm text-muted-foreground">{policy.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {activeTab === "channels" ? (
                      <span className="font-mono text-sm">{(policy as any).channel}</span>
                    ) : (
                      (policy as any).applied?.startsWith("perimeter:") ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {(policy as any).applied.replace("perimeter: ", "")}
                        </span>
                      ) : (
                        (policy as any).applied || "N/A"
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-right">{policy.updated}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Policy Modal */}
      <CreatePolicyModal
        open={createPolicyModalOpen}
        onOpenChange={setCreatePolicyModalOpen}
      />
    </div>
  )
}