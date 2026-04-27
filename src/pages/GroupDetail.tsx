import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { SearchIcon, ArrowLeftIcon, TrashIcon } from "lucide-react"

interface GroupDetailProps {
  groupId: string
  onNavigate?: (url: string) => void
}

// Mock group data
const groupData = {
  "1": {
    name: "Data Science Team",
    description: "Data scientists and ML engineers",
    members: 12,
    perimeters: "default, staging",
    created: "Mar 15, 2026",
    lastModified: "Apr 20, 2026"
  }
}

const groupUsers = [
  {
    id: "1",
    name: "Erika Yee",
    email: "erika@anaconda.com",
    role: "admin",
    lastActive: "Apr 21, 2026"
  },
  {
    id: "2",
    name: "John Smith",
    email: "john@anaconda.com",
    role: "user",
    lastActive: "Apr 20, 2026"
  }
]

const modelPolicies = [
  {
    id: "1",
    name: "Data Privacy Compliance",
    description: "Ensures models comply with GDPR and data privacy regulations",
    applied: "perimeter: default",
    updated: "Dec 13, 2024 at 9:45 AM"
  }
]

const channels = [
  {
    id: "1",
    name: "conda-forge",
    type: "Public",
    packages: 1250,
    lastSync: "Apr 21, 2026"
  },
  {
    id: "2",
    name: "anaconda-main",
    type: "Private",
    packages: 850,
    lastSync: "Apr 21, 2026"
  }
]

const tabs = [
  { id: "users", label: "Users" },
  { id: "policies", label: "Model Policies" },
  { id: "channels", label: "Channels" }
]

export function GroupDetail({ groupId, onNavigate }: GroupDetailProps) {
  const [activeTab, setActiveTab] = React.useState("users")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([])

  const group = groupData[groupId as keyof typeof groupData]

  if (!group) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Group not found.</p>
      </div>
    )
  }

  const handleBack = () => {
    onNavigate?.("/identity-access/identities")
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button and Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Identities
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{group.name}</h1>
        <p className="text-muted-foreground">{group.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{group.members} members</span>
          <span>Created {group.created}</span>
          <span>Last modified {group.lastModified}</span>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-96">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">Add Users</Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
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

      {/* Model Policies Tab */}
      {activeTab === "policies" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Applied Model Policies</h3>
            <Button variant="outline" size="sm">Apply Policy</Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{policy.name}</div>
                        <div className="text-sm text-muted-foreground">{policy.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {policy.applied}
                      </Badge>
                    </TableCell>
                    <TableCell>{policy.updated}</TableCell>
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

      {/* Channels Tab */}
      {activeTab === "channels" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Channel Access</h3>
            <Button variant="outline" size="sm">Grant Access</Button>
          </div>

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
                {channels.map((channel) => (
                  <TableRow key={channel.id}>
                    <TableCell>
                      <div className="font-medium">{channel.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={channel.type === "Public" ? "secondary" : "outline"}>
                        {channel.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{channel.packages}</TableCell>
                    <TableCell>{channel.lastSync}</TableCell>
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
    </div>
  )
}