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
import { Dashboard, ComplianceReporting, PlatformHealth, Policies } from "@/pages"
import { CloudProviderModal } from "@/components/CloudProviderModal"
import { ConfigurePerimeterModal } from "@/components/ConfigurePerimeterModal"

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
  const [cloudModalOpen, setCloudModalOpen] = useState(false)
  const [perimeterModalOpen, setPerimeterModalOpen] = useState(false)

  const steps: OnboardingStep[] = [
    {
      id: "auth",
      title: "Integrate auth with WorkOS",
      description: "Wire up your identity provider.",
      isComplete: authConnected,
      action: () => {
        window.open("https://explore.workos.com/app/settings", "_blank")
        setAuthConnected(true)
      },
    },
    {
      id: "cloud",
      title: "Connect your cloud provider",
      description: "Grant read access so we can index resources.",
      isComplete: cloudConnected,
      optional: true,
      action: () => setCloudModalOpen(true),
    },
    {
      id: "perimeters",
      title: "Configure perimeter",
      description:
        "Define the network boundaries your clusters can reach.",
      isComplete: perimetersConfigured,
      optional: true,
      action: () => setPerimeterModalOpen(true),
    },
  ]

  // Conditional rendering: show modals when opened, otherwise show onboarding
  if (cloudModalOpen) {
    return (
      <CloudProviderModal
        onComplete={() => {
          setCloudConnected(true)
          setCloudModalOpen(false)
        }}
        onCancel={() => {
          setCloudModalOpen(false)
        }}
      />
    )
  }

  if (perimeterModalOpen) {
    return (
      <ConfigurePerimeterModal
        onComplete={() => {
          setPerimetersConfigured(true)
          setPerimeterModalOpen(false)
        }}
        onCancel={() => {
          setPerimeterModalOpen(false)
        }}
      />
    )
  }

  return (
    <OnboardingLayout
      title="Set up your workspace"
      description="Complete the WorkOS integration to get started."
      steps={steps}
      requiredStepId="auth"
      onComplete={onDone}
    />
  )
}

// The default "route" when you first enter the app. Matches the
// `url` on the Dashboard item in `src/components/app-sidebar.tsx`.
// In a real app this would come from the router (useLocation,
// Next.js pathname, etc.).
const DEFAULT_NAV_KEY = "/dashboard"

function AppDemo() {
  const [actionOpen, setActionOpen] = useState(false)
  const [clusterName, setClusterName] = useState("production-us-east-1")
  const [navKey, setNavKey] = useState<string>(DEFAULT_NAV_KEY)

  // Derive a page title from the active nav key's last segment.
  // In a routed app this would come from route config.
  const lastSegment = navKey.split("/").filter(Boolean).pop() ?? ""
  const pageTitle =
    lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)

  // Render different content based on the active nav key
  const renderMainContent = () => {
    if (navKey === "/dashboard") {
      return <Dashboard onNavigate={setNavKey} />
    }

    if (navKey === "/security-policy/policies") {
      return <Policies onNavigate={setNavKey} />
    }

    if (navKey === "/compliance-reporting") {
      return <ComplianceReporting onNavigate={setNavKey} />
    }

    if (navKey === "/platform-health") {
      return <PlatformHealth />
    }

    // Default content for other pages
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          This is a placeholder page for {pageTitle}. Content will be added here.
        </p>
      </div>
    )
  }

  return (
    <AppShellLayout
      title={pageTitle || "Dashboard"}
      activeKey={navKey}
      onNavigate={setNavKey}
      headerActions={
        navKey === "/dashboard" ? (
          <Button size="sm" onClick={() => setActionOpen(true)}>
            Customize Dashboard
          </Button>
        ) : navKey !== "/compliance-reporting" && navKey !== "/platform-health" ? (
          <Button size="sm" onClick={() => setActionOpen(true)}>
            Manage
          </Button>
        ) : undefined
      }
    >
      {renderMainContent()}

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
