import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

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
   * Right-side action slot. Typically a Button that triggers the
   * step's flow (connector, form, external link). Hidden once the
   * step is complete.
   */
  action: React.ReactNode
  /**
   * Optional extra content shown inline under the row while the step
   * is *not* yet complete — e.g. a form or additional guidance. Once
   * the step is complete the inline content collapses away.
   */
  content?: React.ReactNode
  /** Whether the step has been completed. Controls the checkmark. */
  isComplete: boolean
}

export interface OnboardingLayoutProps {
  /** Ordered steps the user must complete to exit the gate. */
  steps: OnboardingStep[]
  /**
   * Called once every step reports `isComplete`. The consumer should
   * unmount this layout and mount `AppShellLayout`. There is no
   * explicit "Enter app" button — transition happens automatically
   * as soon as every step is done.
   */
  onComplete?: () => void
  /** Card title. Defaults to "Set up your workspace". */
  title?: string
  /** Card description. */
  description?: string
}

export function OnboardingLayout({
  steps,
  onComplete,
  title = "Set up your workspace",
  description = "Complete these steps to get started.",
}: OnboardingLayoutProps) {
  const completedCount = steps.filter((s) => s.isComplete).length
  const totalSteps = steps.length
  const allComplete = completedCount === totalSteps

  React.useEffect(() => {
    if (allComplete) onComplete?.()
  }, [allComplete, onComplete])

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
        <CardHeader className="gap-3">
          <div className="space-y-1.5">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Progress
            value={(completedCount / totalSteps) * 100}
            aria-label={`Onboarding progress: ${completedCount} of ${totalSteps} steps complete`}
          />
          <div className="text-xs text-muted-foreground">
            {completedCount} of {totalSteps} complete
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {steps.map((step) => (
            <ChecklistRow key={step.id} step={step} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function ChecklistRow({ step }: { step: OnboardingStep }) {
  const { title, description, action, content, isComplete } = step

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-4 transition-colors",
        isComplete
          ? "bg-muted/40 border-transparent"
          : "bg-background border-border"
      )}
      data-complete={isComplete}
    >
      <div className="flex items-start gap-3">
        <CheckCircle complete={isComplete} />
        <div className="flex-1 space-y-0.5">
          <div
            className={cn(
              "text-sm font-medium leading-none",
              isComplete && "text-muted-foreground line-through"
            )}
          >
            {title}
          </div>
          {description && (
            <div className="text-xs text-muted-foreground">{description}</div>
          )}
        </div>
        {!isComplete && <div className="shrink-0">{action}</div>}
      </div>
      {!isComplete && content && (
        <div className="pl-8 text-sm">{content}</div>
      )}
    </div>
  )
}

function CheckCircle({ complete }: { complete: boolean }) {
  return (
    <div
      className={cn(
        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
        complete
          ? "bg-primary border-primary text-primary-foreground"
          : "border-border text-transparent"
      )}
      aria-hidden
    >
      <CheckIcon className="size-3" />
    </div>
  )
}
