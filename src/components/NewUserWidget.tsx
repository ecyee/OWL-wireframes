import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckIcon, ArrowRightIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewUserStep {
  id: string
  title: string
  completed: boolean
}

const newUserSteps: NewUserStep[] = [
  { id: "policy", title: "Create your first policy", completed: false },
  { id: "team", title: "Invite admins and set up your team", completed: false },
  { id: "perimeters", title: "Configure perimeters and set up service accounts", completed: false },
  { id: "compute", title: "Add compute", completed: false },
  { id: "notifications", title: "Set up notifications", completed: false },
  { id: "integrations", title: "Set up integrations", completed: false },
]

interface NewUserWidgetProps {
  onDismiss?: () => void
  onNavigate?: (url: string) => void
}

export function NewUserWidget({ onDismiss, onNavigate }: NewUserWidgetProps = {}) {
  const [steps, setSteps] = React.useState(newUserSteps)
  const [showGuidedTour, setShowGuidedTour] = React.useState(true)

  const activeSteps = steps.filter(step => !step.completed)
  const totalSteps = steps.length
  const completedCount = totalSteps - activeSteps.length

  const handleStepClick = (stepId: string) => {
    // Navigate to appropriate page based on step
    const navigationMap: Record<string, string> = {
      policy: "/security-policy/policies",
      team: "/identity-access/identities",
      perimeters: "/configuration/perimeters",
      compute: "/configuration/compute",
      notifications: "/platform-health/system-status", // or wherever notifications are managed
      integrations: "/configuration", // or a specific integrations page
    }

    const targetUrl = navigationMap[stepId]
    if (targetUrl && onNavigate) {
      onNavigate(targetUrl)
    }

    // Mark step as completed and remove from list
    setSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, completed: true } : step
    ))
  }

  const handleGuidedTour = () => {
    // In a real app, this would trigger the guided walkthrough
    console.log("Starting guided walkthrough...")
    setShowGuidedTour(false)
  }

  const handleDismiss = () => {
    onDismiss?.()
  }

  // Auto-dismiss when all steps are completed
  React.useEffect(() => {
    if (activeSteps.length === 0 && completedCount > 0) {
      // Small delay to let user see the completion before auto-dismissing
      const timer = setTimeout(() => {
        onDismiss?.()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [activeSteps.length, completedCount, onDismiss])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>Welcome to Acme Corp</CardTitle>
            <CardDescription>
              Complete these steps to get the most out of your admin console
            </CardDescription>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-4" />
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {completedCount} of {totalSteps} completed
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {activeSteps.length === 0 && completedCount > 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckIcon className="size-12 text-green-600 mb-3" />
            <h3 className="text-lg font-medium text-foreground mb-1">All done!</h3>
            <p className="text-sm text-muted-foreground">
              You've completed all the setup steps
            </p>
          </div>
        ) : (
          activeSteps.map((step) => (
            <div
              key={step.id}
              className="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer bg-background border-border hover:bg-muted/20"
              onClick={() => handleStepClick(step.id)}
            >
              <div className="flex items-center justify-center size-8 rounded-full bg-muted shrink-0">
                <div className="size-8 rounded-full border-2 border-muted-foreground/30" />
              </div>

              <div className="flex-1">
                <span className="text-sm font-medium">
                  {step.title}
                </span>
              </div>

              <ArrowRightIcon className="size-4 text-muted-foreground hover:text-foreground transition-colors" />
            </div>
          ))
        )}

        {showGuidedTour && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleGuidedTour}
              className="w-full"
            >
              Take a guided walkthrough
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}