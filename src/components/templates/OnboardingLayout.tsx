import * as React from "react"
import { CheckIcon, ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * Canonical gated **platform-onboarding** surface.
 *
 * Renders the Anaconda wordmark above a centered Card with a
 * checklist of steps. Each row shows a circle that fills with a
 * checkmark once `isComplete` is true. The consumer supplies the
 * action for each step in the `action` slot — typically a button
 * that opens a form, runs an OAuth flow, or links out to an
 * external flow. There is no explicit "Enter app" button; as soon
 * as every step reports complete, `onComplete` fires and the
 * consumer is expected to unmount this layout and mount
 * `AppShellLayout`.
 *
 * **NOT for in-app setup flows.** This is the one-time, first-run,
 * pre-shell gate. In-app step-by-step wizards (e.g. creating a
 * perimeter from inside Governance, wiring up a new integration)
 * look similar but are a different surface — they ship inside
 * `AppShellLayout` as an `ActionSheet` with internal steps. Using
 * this template for an in-app wizard is a bug.
 * See `docs/interaction-model.md` and
 * `src/components/templates/CLAUDE.md` for the full distinction.
 *
 * @example
 * ```tsx
 * const [cloud, setCloud] = useState(false)
 * const [auth, setAuth] = useState(false)
 * const [perimeter, setPerimeter] = useState(false)
 *
 * <OnboardingLayout
 *   appName="OWL"
 *   title="Set up your workspace"
 *   description="Complete these steps to get started."
 *   steps={[
 *     {
 *       id: "cloud",
 *       title: "Connect your cloud provider",
 *       description: "Grant read access so we can index resources.",
 *       isComplete: cloud,
 *       action: <Button onClick={() => setCloud(true)}>Connect</Button>,
 *     },
 *     { id: "auth", title: "Integrate auth with WorkOS", ... },
 *     { id: "perimeter", title: "Create perimeters", ... },
 *   ]}
 *   onComplete={() => navigate("/app")}
 * />
 * ```
 */
export interface OnboardingStep {
  /** Stable identifier for the step. */
  id: string
  /** Row title. */
  title: string
  /** Short explanation under the title. */
  description?: string
  /**
   * Function to call when the step is clicked. Replaces the old action slot
   * since the entire row is now clickable.
   */
  action: () => void
  /**
   * Optional extra content shown inline under the row while the step
   * is *not* yet complete — e.g. a form or additional guidance. Once
   * the step is complete the inline content collapses away.
   */
  content?: React.ReactNode
  /** Whether the step has been completed. Controls the checkmark. */
  isComplete: boolean
  /** Whether this step is optional. Optional steps don't block completion. */
  optional?: boolean
}

export interface OnboardingLayoutProps {
  /** Ordered steps the user must complete to exit the gate. */
  steps: OnboardingStep[]
  /**
   * Called when the user clicks the "Skip" button.
   */
  onComplete?: () => void
  /** Card title. Defaults to "Set up your workspace". */
  title?: string
  /** Card description. */
  description?: string
  /** ID of the step that must be completed to show the Skip button. */
  requiredStepId: string
}

export function OnboardingLayout({
  steps,
  onComplete,
  title = "Set up your workspace",
  description = "Complete these steps to get started.",
  requiredStepId,
}: OnboardingLayoutProps) {
  const requiredStep = steps.find((s) => s.id === requiredStepId)
  const canShowSkip = requiredStep?.isComplete ?? false
  const allStepsComplete = steps.every(step => step.isComplete)

  // Auto-complete when all steps are done
  React.useEffect(() => {
    if (allStepsComplete) {
      onComplete?.()
    }
  }, [allStepsComplete, onComplete])

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Anaconda wordmark — sits above the card as the platform
          brand header. Height is tuned to feel proportional next to
          the card's title (the wordmark's native aspect is ~5.85:1
          so `h-8` renders ~47px wide, which reads as a mark, not a
          banner). Margin-bottom pairs it with the card at roughly
          the same rhythm as the card's internal `gap-3`. */}
      <img
        src="/brand/anaconda-logo.svg"
        alt="Anaconda"
        className="mb-6 h-8 w-auto select-none"
        draggable={false}
      />

      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="space-y-1.5">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {steps.map((step) => (
            <ChecklistRow key={step.id} step={step} />
          ))}
        </CardContent>
      </Card>

      {/* Skip button appears below the card after required step is complete */}
      {canShowSkip && (
        <Button
          onClick={onComplete}
          variant="outline"
          className="mt-4"
        >
          Skip
        </Button>
      )}
    </div>
  )
}

function ChecklistRow({ step }: { step: OnboardingStep }) {
  const { title, description, content, isComplete, optional, action } = step

  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-lg border p-4 transition-colors",
        isComplete
          ? "bg-muted/40 border-transparent"
          : "bg-background border-border hover:bg-muted/20 cursor-pointer"
      )}
      data-complete={isComplete}
      onClick={() => {
        if (!isComplete && action) {
          action()
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-0.5">
          <div
            className={cn(
              "text-sm font-medium leading-none flex items-center gap-2",
              isComplete && "text-muted-foreground line-through"
            )}
          >
            {title}
            {optional && (
              <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md">
                Optional
              </span>
            )}
          </div>
          {description && (
            <div className="text-xs text-muted-foreground">{description}</div>
          )}
        </div>
        <div className="shrink-0 flex items-center justify-center ml-3">
          {isComplete ? (
            <CheckIcon className="size-4 text-green-600" />
          ) : (
            <ArrowRightIcon className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
          )}
        </div>
      </div>
      {!isComplete && content && (
        <div className="text-sm">{content}</div>
      )}
    </div>
  )
}

