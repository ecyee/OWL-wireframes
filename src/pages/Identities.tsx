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
import { SearchIcon, TrashIcon, UsersIcon } from "lucide-react"

interface IdentitiesProps {
  onNavigate?: (url: string) => void
  onCreateGroup?: () => void
}

const users = [
  {
    id: "1",
    name: "Erika Yee",
    email: "erika@anaconda.com",
    perimeter: "default",
    role: "admin",
    groups: "--",
    resources: "--",
    lastActive: "Apr 21, 2026"
  },
  {
    id: "2",
    name: "Katy Cranfill",
    email: "katy@anaconda.com",
    perimeter: "default, staging",
    role: "admin",
    groups: "--",
    resources: "--",
    lastActive: "Apr 21, 2026"
  }
]

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
  { value: "channel-manager", label: "Channel Manager" },
  { value: "environment-manager", label: "Environment Manager" },
  { value: "policy-manager", label: "Policy Manager" },
  { value: "viewer", label: "Viewer" },
  { value: "developer", label: "Developer" },
]

const groups = [
  {
    id: "1",
    name: "Data Science Team",
    description: "Data scientists and ML engineers",
    members: 12,
    perimeters: "default, staging",
    created: "Mar 15, 2026",
    lastModified: "Apr 20, 2026"
  },
  {
    id: "2",
    name: "Engineering",
    description: "Software development team",
    members: 25,
    perimeters: "default, staging, production",
    created: "Feb 10, 2026",
    lastModified: "Apr 18, 2026"
  },
  {
    id: "3",
    name: "Platform Admins",
    description: "Platform administrators and DevOps",
    members: 5,
    perimeters: "default, staging, production",
    created: "Jan 5, 2026",
    lastModified: "Apr 21, 2026"
  },
  {
    id: "4",
    name: "Channel Managers",
    description: "Package and channel management team",
    members: 8,
    perimeters: "default, production",
    created: "Mar 1, 2026",
    lastModified: "Apr 19, 2026"
  }
]

const tabs = [
  { id: "users", label: "Users" },
  { id: "groups", label: "Groups" },
  { id: "service-accounts", label: "Service Accounts" }
]

export function Identities({ onNavigate, onCreateGroup }: IdentitiesProps = {}) {
  const [activeTab, setActiveTab] = React.useState("users")
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [userRoles, setUserRoles] = React.useState<Record<string, string>>({
    "1": "admin",
    "2": "admin"
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    setUserRoles(prev => ({
      ...prev,
      [userId]: newRole
    }))
  }

  const handleSelectAllGroups = (checked: boolean) => {
    if (checked) {
      setSelectedGroups(groups.map(group => group.id))
    } else {
      setSelectedGroups([])
    }
  }

  const handleSelectGroup = (groupId: string, checked: boolean) => {
    if (checked) {
      setSelectedGroups([...selectedGroups, groupId])
    } else {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId))
    }
  }

  const handleGroupClick = (groupId: string) => {
    onNavigate?.(`/identity-access/identities/group/${groupId}`)
  }

  return (
    <div className="p-6 space-y-6">

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

      {/* Conditional Content based on active tab */}
      {activeTab === "users" && (
        <>
          {/* Status Bar */}
          <div className="space-y-2">
            <div className="w-80 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: '65%' }}
              ></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">65/100 Seats</span>
              <Button variant="link" className="text-blue-600 p-0 h-auto">
                Manage subscription
              </Button>
            </div>
          </div>

          {/* Search and Export */}
          <div className="flex items-center justify-between">
            <div className="relative w-96">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Export List</Button>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === users.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Perimeter</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Group(s)</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
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
                      <span className="text-sm">{user.perimeter}</span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={userRoles[user.id]}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-40 border-0 shadow-none p-0 h-auto bg-transparent hover:bg-muted">
                          <SelectValue className="text-sm underline" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{user.groups}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{user.resources}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{user.lastActive}</span>
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
        </>
      )}

      {/* Groups Tab Content */}
      {activeTab === "groups" && (
        <>
          {/* Search and Actions */}
          <div className="flex items-center justify-between">
            <div className="relative w-96">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {selectedGroups.length > 0 && (
                <Button variant="outline" size="sm">
                  Delete Selected ({selectedGroups.length})
                </Button>
              )}
              <Button variant="outline" size="sm">Export List</Button>
            </div>
          </div>

          {/* Groups Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedGroups.length === groups.length}
                      onCheckedChange={handleSelectAllGroups}
                    />
                  </TableHead>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Perimeters</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedGroups.includes(group.id)}
                        onCheckedChange={(checked) => handleSelectGroup(group.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <button
                          onClick={() => handleGroupClick(group.id)}
                          className="font-medium text-left hover:text-primary cursor-pointer"
                        >
                          {group.name}
                        </button>
                        <div className="text-sm text-muted-foreground">{group.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{group.members}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {group.perimeters.split(", ").map((perimeter) => (
                          <Badge key={perimeter} variant="secondary" className="text-xs">
                            {perimeter}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{group.created}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{group.lastModified}</span>
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
        </>
      )}

      {/* Service Accounts Tab Content - Placeholder */}
      {activeTab === "service-accounts" && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Service Accounts content coming soon.</p>
        </div>
      )}
    </div>
  )
}