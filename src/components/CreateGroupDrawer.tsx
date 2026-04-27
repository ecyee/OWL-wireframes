import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { XIcon, SearchIcon } from "lucide-react"

interface CreateGroupDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const availableUsers = [
  { id: "1", name: "Erika Yee", email: "erika@anaconda.com", role: "Admin" },
  { id: "2", name: "Katy Cranfill", email: "katy@anaconda.com", role: "Admin" },
  { id: "3", name: "John Smith", email: "john@anaconda.com", role: "Developer" },
  { id: "4", name: "Sarah Johnson", email: "sarah@anaconda.com", role: "Data Scientist" },
  { id: "5", name: "Mike Chen", email: "mike@anaconda.com", role: "Developer" },
  { id: "6", name: "Lisa Rodriguez", email: "lisa@anaconda.com", role: "Channel Manager" },
]

const permissions = [
  { value: "admin", label: "Admin", description: "Full administrative access" },
  { value: "environment-manager", label: "Environment Manager", description: "Manage environments and compute" },
  { value: "channel-manager", label: "Channel Manager", description: "Manage packages and channels" },
  { value: "policy-manager", label: "Policy Manager", description: "Create and manage policies" },
  { value: "developer", label: "Developer", description: "Development and deployment access" },
  { value: "viewer", label: "Viewer", description: "Read-only access" },
]

const perimeters = [
  { value: "default", label: "Default" },
  { value: "staging", label: "Staging" },
  { value: "production", label: "Production" },
]

export function CreateGroupDrawer({ open, onOpenChange }: CreateGroupDrawerProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    permissions: "",
    perimeters: [] as string[],
  })
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([])
  const [userSearch, setUserSearch] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    onOpenChange(false)
    // Reset form
    setFormData({
      name: "",
      description: "",
      permissions: "",
      perimeters: [],
    })
    setSelectedUsers([])
    setUserSearch("")
  }

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handlePerimeterToggle = (perimeter: string) => {
    setFormData(prev => ({
      ...prev,
      perimeters: prev.perimeters.includes(perimeter)
        ? prev.perimeters.filter(p => p !== perimeter)
        : [...prev.perimeters, perimeter]
    }))
  }

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-1/3 max-w-none flex flex-col p-0 h-full" style={{ width: '33.333333vw', maxWidth: 'none' }}>
        {/* Sticky Header */}
        <SheetHeader className="p-8 pb-6 border-b bg-background">
          <SheetTitle className="text-xl">Create Group</SheetTitle>
        </SheetHeader>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="groupName">Group Name *</Label>
                  <Input
                    id="groupName"
                    placeholder="Enter group name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter group description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Permissions</h3>

                <div className="space-y-2">
                  <Label>Default Permission Level *</Label>
                  <Select value={formData.permissions} onValueChange={(value) => setFormData({ ...formData, permissions: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select permission level" />
                    </SelectTrigger>
                    <SelectContent>
                      {permissions.map((permission) => (
                        <SelectItem key={permission.value} value={permission.value}>
                          <div>
                            <div className="font-medium">{permission.label}</div>
                            <div className="text-xs text-muted-foreground">{permission.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Perimeters */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Perimeters</h3>
                <div className="space-y-3">
                  {perimeters.map((perimeter) => (
                    <div key={perimeter.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={perimeter.value}
                        checked={formData.perimeters.includes(perimeter.value)}
                        onCheckedChange={() => handlePerimeterToggle(perimeter.value)}
                      />
                      <Label htmlFor={perimeter.value}>{perimeter.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Members */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Members</h3>

                <div className="space-y-3">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {selectedUsers.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Members ({selectedUsers.length})</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedUsers.map((userId) => {
                          const user = availableUsers.find(u => u.id === userId)
                          return user ? (
                            <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                              {user.name}
                              <button
                                type="button"
                                onClick={() => handleUserToggle(userId)}
                                className="ml-1 hover:bg-secondary-foreground/20 rounded-sm"
                              >
                                <XIcon className="h-3 w-3" />
                              </button>
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}

                  <div className="border rounded-lg max-h-60 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center p-3 hover:bg-muted/50 border-b last:border-b-0"
                      >
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleUserToggle(user.id)}
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="flex-shrink-0 p-8 pt-6 border-t bg-background">
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={!formData.name || !formData.permissions}
              >
                Create Group
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}