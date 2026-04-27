import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SearchIcon, CheckIcon, ChevronRightIcon, PlusIcon } from "lucide-react"

interface CreateWorkstationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const availableUsers = [
  { value: "erika", label: "Erika Yee" },
  { value: "katy", label: "Katy Cranfill" },
  { value: "john", label: "John Smith" },
  { value: "sarah", label: "Sarah Johnson" },
  { value: "mike", label: "Mike Chen" },
]

const containerImages = [
  { value: "anaconda/datascience:2024.02", label: "Data Science (2024.02)" },
  { value: "anaconda/pytorch:2024.01", label: "PyTorch (2024.01)" },
  { value: "anaconda/tensorflow:2024.01", label: "TensorFlow (2024.01)" },
  { value: "anaconda/base:2024.02", label: "Base Environment (2024.02)" },
  { value: "anaconda/r:2024.01", label: "R Environment (2024.01)" },
]

const autoHibernateOptions = [
  { value: "never", label: "Never" },
  { value: "30min", label: "30 minutes" },
  { value: "1hour", label: "1 hour" },
  { value: "2hours", label: "2 hours" },
  { value: "4hours", label: "4 hours" },
  { value: "8hours", label: "8 hours" },
]

const computePools = [
  { value: "default", label: "Default Pool" },
  { value: "gpu-pool", label: "GPU Pool" },
  { value: "high-memory", label: "High Memory Pool" },
  { value: "spot-instances", label: "Spot Instances Pool" },
]

export function CreateWorkstationDrawer({ open, onOpenChange }: CreateWorkstationDrawerProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    owner: "eyee@anaconda.com",
    image: "obp-workstations/python-3.12-bullseye",
    autoHibernate: "never",
    cpuCores: "2",
    memory: "4",
    disk: "20",
    gpu: "0",
    computePool: "auto",
  })
  const [showComputePoolOptions, setShowComputePoolOptions] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    onOpenChange(false)
    // Reset form
    setFormData({
      name: "",
      owner: "eyee@anaconda.com",
      image: "obp-workstations/python-3.12-bullseye",
      autoHibernate: "never",
      cpuCores: "2",
      memory: "4",
      disk: "20",
      gpu: "0",
      computePool: "auto",
    })
    setShowComputePoolOptions(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-1/3 max-w-none flex flex-col p-0 h-full" style={{ width: '33.333333vw', maxWidth: 'none' }}>
        {/* Sticky Header */}
        <SheetHeader className="p-8 pb-6 border-b bg-background">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-6 h-6 bg-green-600 rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 border border-white rounded-sm"></div>
              </div>
            </div>
            <SheetTitle className="text-xl">Create a new workstation</SheetTitle>
          </div>
        </SheetHeader>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-6">
              {/* Workstation Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Workstation Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="workstationName">Name *</Label>
                  <Input
                    id="workstationName"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Owner *</Label>
                  <div className="flex items-center justify-between px-3 py-2 border rounded-md bg-background">
                    <span className="text-sm">{formData.owner}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-green-600 hover:text-green-700"
                    >
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Additional users
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image *</Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search images..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Auto-Hibernate</Label>
                  <Select value={formData.autoHibernate} onValueChange={(value) => setFormData({ ...formData, autoHibernate: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {autoHibernateOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Resources */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Resources</h3>
                <p className="text-sm text-muted-foreground">Define the resources required for your workstation</p>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium">CPU</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 bg-background border rounded flex items-center justify-center">
                          <div className="w-4 h-4 bg-muted-foreground rounded-sm"></div>
                        </div>
                        <Input
                          type="number"
                          value={formData.cpuCores}
                          onChange={(e) => setFormData({ ...formData, cpuCores: e.target.value })}
                          className="flex-1"
                          min="1"
                          max="32"
                        />
                        <span className="text-sm text-muted-foreground">Cores</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Memory</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 bg-background border rounded flex items-center justify-center">
                          <div className="w-4 h-4 bg-muted-foreground rounded-sm"></div>
                        </div>
                        <Input
                          type="number"
                          value={formData.memory}
                          onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
                          className="flex-1"
                          min="1"
                          max="128"
                        />
                        <span className="text-sm text-muted-foreground">GB</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Disk</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 bg-background border rounded flex items-center justify-center">
                          <div className="w-4 h-4 bg-muted-foreground rounded-sm"></div>
                        </div>
                        <Input
                          type="number"
                          value={formData.disk}
                          onChange={(e) => setFormData({ ...formData, disk: e.target.value })}
                          className="flex-1"
                          min="10"
                          max="2000"
                        />
                        <span className="text-sm text-muted-foreground">GB</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">GPU</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 bg-background border rounded flex items-center justify-center">
                          <div className="w-4 h-4 bg-muted-foreground rounded-sm"></div>
                        </div>
                        <Input
                          type="number"
                          value={formData.gpu}
                          onChange={(e) => setFormData({ ...formData, gpu: e.target.value })}
                          className="flex-1"
                          min="0"
                          max="8"
                        />
                        <span className="text-sm text-muted-foreground">GPUs</span>
                      </div>
                    </div>
                  </div>

                  {/* Compute Pool Status */}
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">Workstation will be scheduled on the best fit compute pool</span>
                    </div>
                  </div>

                  {/* Expandable Compute Pool Options */}
                  <Collapsible open={showComputePoolOptions} onOpenChange={setShowComputePoolOptions}>
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start p-0 mt-3 text-muted-foreground hover:text-foreground"
                      >
                        <ChevronRightIcon className={`w-4 h-4 mr-2 transition-transform ${showComputePoolOptions ? 'rotate-90' : ''}`} />
                        I want to choose a compute pool
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      <div className="space-y-2">
                        <Label>Compute Pool</Label>
                        <Select value={formData.computePool} onValueChange={(value) => setFormData({ ...formData, computePool: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {computePools.map((pool) => (
                              <SelectItem key={pool.value} value={pool.value}>
                                {pool.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
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
                disabled={!formData.name}
              >
                Create Workstation
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}