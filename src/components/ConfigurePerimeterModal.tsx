import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface ConfigurePerimeterModalProps {
  onComplete: () => void
  onCancel: () => void
}

type PerimeterStep = "details" | "container-images" | "resource-limits" | "users"

const steps = [
  { id: "details" as const, title: "Details", number: 1 },
  { id: "container-images" as const, title: "Container Images", number: 2 },
  { id: "resource-limits" as const, title: "Resource Limits", number: 3 },
  { id: "users" as const, title: "Users", number: 4 },
]

export function ConfigurePerimeterModal({
  onComplete,
  onCancel,
}: ConfigurePerimeterModalProps) {
  const [currentStep, setCurrentStep] = React.useState<PerimeterStep>("details")
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    containerImages: "",
    resourceLimits: "",
    users: "",
    serviceAccounts: "",
  })

  const getCurrentStepNumber = () => {
    return steps.find(step => step.id === currentStep)?.number || 1
  }

  const isLastStep = () => currentStep === "users"
  const isFirstStep = () => currentStep === "details"

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const handleBack = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  const handleComplete = () => {
    onComplete()
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "details":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Enter perimeter name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Enter perimeter description"
                rows={3}
              />
            </div>
          </div>
        )

      case "container-images":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="container-images">Container Images</Label>
              <p className="text-sm text-muted-foreground">
                Specify container images that may be used to run tasks in this perimeter, via direct references to
                existing...
              </p>
              <Textarea
                id="container-images"
                value={formData.containerImages}
                onChange={(e) => updateFormData("containerImages", e.target.value)}
                placeholder="e.g. ubuntu:latest, python:3.9"
                rows={4}
              />
              <Button variant="outline" size="sm">
                Custom Image
              </Button>
            </div>
          </div>
        )

      case "resource-limits":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resource-limits">Resource Limits</Label>
              <p className="text-sm text-muted-foreground">
                Task Resource Limits
              </p>
              <p className="text-sm text-muted-foreground">
                Set the maximum amount of compute that any workflow step can request within this perimeter.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpu">CPU</Label>
                  <Input
                    id="cpu"
                    placeholder="2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memory">Memory (GB)</Label>
                  <Input
                    id="memory"
                    placeholder="8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="disk">Disk (GB)</Label>
                <Input
                  id="disk"
                  placeholder="100"
                  className="w-1/2"
                />
              </div>
            </div>
          </div>
        )

      case "users":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="users">Users</Label>
              <p className="text-sm text-muted-foreground">
                The maximum amount of memory any step is allowed to request.
              </p>
              <Textarea
                id="users"
                value={formData.users}
                onChange={(e) => updateFormData("users", e.target.value)}
                placeholder="Enter user emails or IDs"
                rows={4}
              />
            </div>
          </div>
        )


      default:
        return null
    }
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Anaconda wordmark */}
      <img
        src="/brand/anaconda-logo.svg"
        alt="Anaconda"
        className="mb-6 h-8 w-auto select-none"
        draggable={false}
      />

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Setup Perimeter</CardTitle>
          <CardDescription>Configure your perimeter settings and resource boundaries.</CardDescription>
        </CardHeader>

        <CardContent className="min-h-[300px]">
          {renderStepContent()}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div>
            {!isFirstStep() && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={isLastStep() ? handleComplete : handleNext}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLastStep() ? "Create" : "Next"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}