import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckIcon, ArrowRightIcon, XIcon, SparklesIcon } from "lucide-react"
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
  onOpenComputeDrawer?: () => void
}

export function NewUserWidget({ onDismiss, onNavigate, onOpenComputeDrawer }: NewUserWidgetProps = {}) {
  const [steps, setSteps] = React.useState(newUserSteps)
  const [showGuidedTour, setShowGuidedTour] = React.useState(true)

  const activeSteps = steps.filter(step => !step.completed)
  const totalSteps = steps.length
  const completedCount = totalSteps - activeSteps.length

  const handleStepClick = (stepId: string) => {
    // Handle compute step specially - open drawer instead of navigating
    if (stepId === "compute") {
      onOpenComputeDrawer?.()
      // Mark step as completed and remove from list
      setSteps(prev => prev.map(step =>
        step.id === stepId ? { ...step, completed: true } : step
      ))
      return
    }

    // Navigate to appropriate page based on step
    const navigationMap: Record<string, string> = {
      policy: "/security-policy/policies",
      team: "/identity-access/identities",
      perimeters: "/configuration/perimeters",
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
    <Card className="w-full max-w-2xl bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <SparklesIcon className="size-5 text-green-400" />
              <CardTitle className="text-xl text-white">Welcome to Acme Corp</CardTitle>
            </div>
            <CardDescription className="text-slate-300">
              Complete these steps to get the most out of your Anaconda admin console
            </CardDescription>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <XIcon className="size-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalSteps) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-slate-300">
            {completedCount} of {totalSteps} completed
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {activeSteps.length === 0 && completedCount > 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckIcon className="size-12 text-green-400 mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">All done!</h3>
            <p className="text-sm text-slate-300">
              You've completed all the setup steps. Welcome to Anaconda!
            </p>
          </div>
        ) : (
          activeSteps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 transition-colors cursor-pointer bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-600"
              onClick={() => handleStepClick(step.id)}
            >
              <div className="flex items-center justify-center size-8 rounded-full bg-slate-700 shrink-0">
                <span className="text-sm font-medium text-slate-200">
                  {index + 1}
                </span>
              </div>

              <div className="flex-1">
                <span className="text-sm font-medium text-white">
                  {step.title}
                </span>
              </div>

              <ArrowRightIcon className="size-4 text-slate-400 group-hover:text-green-400 transition-colors" />
            </div>
          ))
        )}

        {showGuidedTour && (
          <div className="pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={handleGuidedTour}
              className="w-full bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-500"
            >
              <SparklesIcon className="size-4 mr-2" />
              Take a guided walkthrough
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}