import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import { SearchIcon, MoreHorizontalIcon, MonitorIcon } from "lucide-react"

interface WorkstationsProps {
  onNavigate?: (url: string) => void
  onCreateWorkstation?: () => void
}

// Mock data for workstations
const workstations = [
  {
    id: "1",
    name: "data-science-workstation",
    owner: "Erika Yee",
    image: "anaconda/datascience:2024.02",
    status: "Running",
    resources: "4 CPU, 16 GB RAM, 100 GB Disk",
    created: "Dec 15, 2024 at 2:30 PM",
  },
  {
    id: "2",
    name: "ml-training-env",
    owner: "John Smith",
    image: "anaconda/pytorch:2024.01",
    status: "Stopped",
    resources: "8 CPU, 32 GB RAM, 500 GB Disk, 1 GPU",
    created: "Dec 12, 2024 at 9:15 AM",
  },
  {
    id: "3",
    name: "research-notebook",
    owner: "Sarah Johnson",
    image: "anaconda/tensorflow:2024.01",
    status: "Running",
    resources: "2 CPU, 8 GB RAM, 50 GB Disk",
    created: "Dec 10, 2024 at 4:45 PM",
  },
  {
    id: "4",
    name: "dev-environment",
    owner: "Mike Chen",
    image: "anaconda/base:2024.02",
    status: "Hibernated",
    resources: "4 CPU, 16 GB RAM, 200 GB Disk",
    created: "Dec 8, 2024 at 11:20 AM",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Running":
      return "bg-green-100 text-green-800"
    case "Stopped":
      return "bg-red-100 text-red-800"
    case "Hibernated":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function Workstations({ onNavigate, onCreateWorkstation }: WorkstationsProps = {}) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredWorkstations = workstations.filter(workstation =>
    workstation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workstation.owner.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 space-y-4">
      {/* Search and filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search workstations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Workstations Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Resources</TableHead>
              <TableHead className="text-right">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkstations.map((workstation) => (
              <TableRow key={workstation.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <MonitorIcon className="size-4 text-muted-foreground" />
                    <div className="font-medium">{workstation.name}</div>
                  </div>
                </TableCell>
                <TableCell>{workstation.owner}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {workstation.image}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(workstation.status)} border-0`}
                  >
                    {workstation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {workstation.resources}
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {workstation.created}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Start</DropdownMenuItem>
                      <DropdownMenuItem>Stop</DropdownMenuItem>
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

      {/* Empty state */}
      {filteredWorkstations.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <div className="text-sm text-muted-foreground">
            No workstations found matching "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  )
}