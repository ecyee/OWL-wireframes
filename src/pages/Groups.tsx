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
import { SearchIcon, TrashIcon, UsersIcon } from "lucide-react"

interface GroupsProps {
  onNavigate?: (url: string) => void
  onCreateGroup?: () => void
}

const groups = [
  {
    id: "1",
    name: "Data Science Team",
    description: "Data scientists and ML engineers",
    members: 12,
    perimeters: "default, staging",
    permissions: "Environment Manager",
    created: "Mar 15, 2026",
    lastModified: "Apr 20, 2026"
  },
  {
    id: "2",
    name: "Engineering",
    description: "Software development team",
    members: 25,
    perimeters: "default, staging, production",
    permissions: "Developer",
    created: "Feb 10, 2026",
    lastModified: "Apr 18, 2026"
  },
  {
    id: "3",
    name: "Platform Admins",
    description: "Platform administrators and DevOps",
    members: 5,
    perimeters: "default, staging, production",
    permissions: "Admin",
    created: "Jan 5, 2026",
    lastModified: "Apr 21, 2026"
  },
  {
    id: "4",
    name: "Channel Managers",
    description: "Package and channel management team",
    members: 8,
    perimeters: "default, production",
    permissions: "Channel Manager",
    created: "Mar 1, 2026",
    lastModified: "Apr 19, 2026"
  }
]

export function Groups({ onNavigate, onCreateGroup }: GroupsProps = {}) {
  const [selectedGroups, setSelectedGroups] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSelectAll = (checked: boolean) => {
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

  return (
    <div className="p-6 space-y-6">
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
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Group Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Perimeters</TableHead>
              <TableHead>Permissions</TableHead>
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
                    <div className="font-medium">{group.name}</div>
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
                  <Badge variant="outline" className="text-xs">
                    {group.permissions}
                  </Badge>
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
    </div>
  )
}