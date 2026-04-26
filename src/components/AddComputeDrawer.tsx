import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { XIcon, MonitorIcon, ServerIcon, WorkflowIcon } from "lucide-react"

interface AddComputeDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddComputeDrawer({ open, onOpenChange }: AddComputeDrawerProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    region: "us-west-2",
    usage: "workstations",
    instanceType: "",
    useSpotInstances: false,
    minInstances: "0",
    maxInstances: "10",
    disk: "200"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    onOpenChange(false)
    // Reset form
    setFormData({
      name: "",
      region: "us-west-2",
      usage: "workstations",
      instanceType: "",
      useSpotInstances: false,
      minInstances: "0",
      maxInstances: "10",
      disk: "200"
    })
  }

  const usageOptions = [
    { id: "inference", label: "Inference deployments", icon: ServerIcon },
    { id: "metaflow", label: "Metaflow Tasks", icon: WorkflowIcon },
    { id: "workstations", label: "Workstations", icon: MonitorIcon },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-1/3 max-w-none flex flex-col p-0 h-full" style={{ width: '33.333333vw', maxWidth: 'none' }}>
        {/* Sticky Header */}
        <SheetHeader className="p-8 pb-6 border-b bg-background">
          <SheetTitle className="text-xl">Create a new AWS compute pool</SheetTitle>
        </SheetHeader>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-8">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter compute pool name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Region Field */}
          <div className="space-y-2">
            <Label htmlFor="region" className="text-sm font-medium">Region</Label>
            <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us-west-2">us-west-2</SelectItem>
                <SelectItem value="us-west-1">us-west-1</SelectItem>
                <SelectItem value="us-east-1">us-east-1</SelectItem>
                <SelectItem value="us-east-2">us-east-2</SelectItem>
                <SelectItem value="eu-west-1">eu-west-1</SelectItem>
                <SelectItem value="ap-southeast-1">ap-southeast-1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Usage Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Usage</Label>
            <div className="grid grid-cols-2 gap-3">
              {usageOptions.map((option) => {
                const Icon = option.icon
                return (
                  <div
                    key={option.id}
                    className={`relative cursor-pointer rounded-lg border p-4 transition-colors ${
                      formData.usage === option.id
                        ? "border-green-500 bg-green-50"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setFormData({ ...formData, usage: option.id })}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.usage === option.id
                            ? "border-green-500 bg-green-500"
                            : "border-muted-foreground/50"
                        }`}
                      >
                        {formData.usage === option.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Instance Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Instance</h3>

            {/* Instance Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Instance Type</Label>
              <Select value={formData.instanceType} onValueChange={(value) => setFormData({ ...formData, instanceType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select instance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="t3.micro">t3.micro</SelectItem>
                  <SelectItem value="t3.small">t3.small</SelectItem>
                  <SelectItem value="t3.medium">t3.medium</SelectItem>
                  <SelectItem value="t3.large">t3.large</SelectItem>
                  <SelectItem value="m5.large">m5.large</SelectItem>
                  <SelectItem value="m5.xlarge">m5.xlarge</SelectItem>
                  <SelectItem value="c5.large">c5.large</SelectItem>
                  <SelectItem value="c5.xlarge">c5.xlarge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Spot Instances Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="spot"
                checked={formData.useSpotInstances}
                onCheckedChange={(checked) => setFormData({ ...formData, useSpotInstances: checked as boolean })}
              />
              <Label htmlFor="spot" className="text-sm">Use spot (interruptible) instances</Label>
            </div>

            {/* Instance Count and Disk */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Min. Instances <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  value={formData.minInstances}
                  onChange={(e) => setFormData({ ...formData, minInstances: e.target.value })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Max. Instances <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  value={formData.maxInstances}
                  onChange={(e) => setFormData({ ...formData, maxInstances: e.target.value })}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Disk <span className="text-destructive">*</span>
                  <span className="text-muted-foreground font-normal ml-1">GB</span>
                </Label>
                <Input
                  type="number"
                  value={formData.disk}
                  onChange={(e) => setFormData({ ...formData, disk: e.target.value })}
                  min="50"
                  max="10240"
                />
                <div className="text-xs text-muted-foreground">Min 50 Max 10240</div>
              </div>
            </div>
          </div>

            {/* Task Routing Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Task Routing</h3>
                <Button variant="outline" size="sm" className="text-xs">
                  <span className="w-4 h-4 mr-1">🔒</span>
                  Contact Us
                </Button>
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
                disabled={!formData.name || !formData.instanceType}
              >
                Add
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}