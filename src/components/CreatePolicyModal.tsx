import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronLeftIcon } from "lucide-react"

interface CreatePolicyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const steps = [
  { id: "details", label: "Set details" },
  { id: "package-rules", label: "Set package rules" },
  { id: "vulnerability-rules", label: "Set vulnerability rules" },
  { id: "exceptions", label: "Set exceptions" },
  { id: "assign-channels", label: "Assign to Channel(s)" },
  { id: "review", label: "Review" },
]

export function CreatePolicyModal({ open, onOpenChange }: CreatePolicyModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Handle policy creation
    onOpenChange(false)
    setCurrentStep(0)
    setFormData({ name: "", description: "" })
  }

  const currentStepData = steps[currentStep]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-[80vw] h-[80vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl">Create Policy</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 min-h-0">
          {/* Left Stepper */}
          <div className="w-64 border-r bg-muted/30 p-6">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === currentStep
                        ? "bg-primary text-primary-foreground"
                        : index < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < currentStep ? "✓" : index + 1}
                  </div>
                  <span
                    className={`text-sm ${
                      index === currentStep
                        ? "font-medium text-foreground"
                        : index < currentStep
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Set your policy details</h2>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="policyName">Policy name*</Label>
                        <Input
                          id="policyName"
                          placeholder="Name must be unique"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Hint about how to name your policy</h3>
                      <p className="text-sm text-muted-foreground">
                        Lorem ipsum dolor sit amet dolor. Sit amet lorem ipsum dolor.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Set package rules</h2>
                    <p className="text-muted-foreground">Configure package-specific rules and restrictions.</p>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    Package rules configuration coming soon...
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Set vulnerability rules</h2>
                    <p className="text-muted-foreground">Define vulnerability scanning and blocking rules.</p>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    Vulnerability rules configuration coming soon...
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Set exceptions</h2>
                    <p className="text-muted-foreground">Configure exceptions to your policy rules.</p>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    Exceptions configuration coming soon...
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Assign to Channel(s)</h2>
                    <p className="text-muted-foreground">Select which channels this policy should apply to.</p>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    Channel assignment coming soon...
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Review</h2>
                    <p className="text-muted-foreground">Review your policy configuration before creating.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Policy Details</h3>
                      <p><strong>Name:</strong> {formData.name || "Not specified"}</p>
                      <p><strong>Description:</strong> {formData.description || "No description"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-6 border-t bg-background">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
                  disabled={currentStep === 0 && !formData.name}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === steps.length - 1 ? "Create Policy" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}