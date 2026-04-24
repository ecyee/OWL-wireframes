import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ActionSheet,
  AppShellLayout,
  OnboardingLayout,
  type OnboardingStep,
} from "@/components/templates"

/**
 * Demo harness for the three canonical templates.
 *
 * - Starts in `OnboardingLayout` (gated checklist).
 * - Once every step is complete, unmounts onboarding and renders
 *   `AppShellLayout` (sidebar + header with breadcrumbs + main
 *   content).
 * - Inside the shell, a button opens `ActionSheet` for record edits.
 *
 * Teammates should replace this with real routes once ready.
 */
export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false)

  if (!onboardingComplete) {
    return <OnboardingDemo onDone={() => setOnboardingComplete(true)} />
  }
  return <AppDemo />
}

function OnboardingDemo({ onDone }: { onDone: () => void }) {
  const [cloudConnected, setCloudConnected] = useState(false)
  const [authConnected, setAuthConnected] = useState(false)
  const [perimetersConfigured, setPerimetersConfigured] = useState(false)

  const steps: OnboardingStep[] = [
    {
      id: "cloud",
      title: "Connect your cloud provider",
      description: "Grant read access so we can index resources.",
      isComplete: cloudConnected,
      action: (
        <Button size="sm" onClick={() => setCloudConnected(true)}>
          Setup
        </Button>
      ),
    },
    {
      id: "auth",
      title: "Integrate auth with WorkOS",
      description: "Wire up your identity provider.",
      isComplete: authConnected,
      action: (
        <Button size="sm" onClick={() => setAuthConnected(true)}>
          Setup
        </Button>
      ),
    },
    {
      id: "perimeters",
      title: "Create perimeters",
      description:
        "Define the network boundaries your clusters can reach.",
      isComplete: perimetersConfigured,
      action: (
        <Button size="sm" onClick={() => setPerimetersConfigured(true)}>
          Setup
        </Button>
      ),
    },
  ]

  return (
    <OnboardingLayout
      title="Set up your workspace"
      description="Complete these three steps to unlock the app."
      steps={steps}
      onComplete={onDone}
    />
  )
}

// The default "route" when you first enter the app. Matches the
// `url` on the Overview item in `src/components/app-sidebar.tsx`.
// In a real app this would come from the router (useLocation,
// Next.js pathname, etc.).
const DEFAULT_NAV_KEY = "/overview"

function AppDemo() {
  const [actionOpen, setActionOpen] = useState(false)
  const [clusterName, setClusterName] = useState("production-us-east-1")
  const [navKey, setNavKey] = useState<string>(DEFAULT_NAV_KEY)

  // Derive a page title from the active nav key's last segment.
  // In a routed app this would come from route config.
  const lastSegment = navKey.split("/").filter(Boolean).pop() ?? ""
  const pageTitle =
    lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)

  return (
    <AppShellLayout
      title={pageTitle || "Overview"}
      activeKey={navKey}
      onNavigate={setNavKey}
      headerActions={
        <Button size="sm" onClick={() => setActionOpen(true)}>
          Manage
        </Button>
      }
    >
      <ActionSheet
        open={actionOpen}
        onOpenChange={setActionOpen}
        title="Edit cluster"
        description="Update the connection details for this cluster."
        submitLabel="Save changes"
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 500))
          setActionOpen(false)
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cluster-name">Cluster name</Label>
            <Input
              id="cluster-name"
              value={clusterName}
              onChange={(e) => setClusterName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cluster-region">Primary region</Label>
            <Input id="cluster-region" defaultValue="us-east-1" />
          </div>
        </div>
      </ActionSheet>
    </AppShellLayout>
  )
}
