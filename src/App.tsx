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
import { Dashboard, ComplianceReporting, PlatformHealth, Policies, OrgSettings, Notifications, Identities, Groups } from "@/pages"
import { CloudProviderModal } from "@/components/CloudProviderModal"
import { ConfigurePerimeterModal } from "@/components/ConfigurePerimeterModal"
import { CreateGroupDrawer } from "@/components/CreateGroupDrawer"

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
  const [createGroupDrawerOpen, setCreateGroupDrawerOpen] = useState(false)

  // Derive a page title from the active nav key's last segment.
  // In a routed app this would come from route config.
  const lastSegment = navKey.split("/").filter(Boolean).pop() ?? ""
  let pageTitle: React.ReactNode

  if (navKey === "/identity-access/identities") {
    pageTitle = (
      <div>
        <div className="text-xl font-semibold tracking-tight text-foreground">Identities</div>
        <div className="text-sm text-muted-foreground mt-1">Set up your users and groups...</div>
      </div>
    )
  } else if (navKey === "/identity-access/groups") {
    pageTitle = (
      <div>
        <div className="text-xl font-semibold tracking-tight text-foreground">Groups</div>
        <div className="text-sm text-muted-foreground mt-1">Organize users into groups for easier management...</div>
      </div>
    )
  } else {
    pageTitle = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
  }

  // Render different content based on the active nav key
  const renderMainContent = () => {
    if (navKey === "/dashboard") {
      return <Dashboard onNavigate={setNavKey} />
    }

    if (navKey === "/security-policy/policies") {
      return <Policies onNavigate={setNavKey} />
    }

    if (navKey === "/org-settings") {
      return <OrgSettings onNavigate={setNavKey} />
    }

    if (navKey === "/notifications") {
      return <Notifications onNavigate={setNavKey} />
    }

    if (navKey === "/identity-access/identities") {
      return <Identities onNavigate={setNavKey} />
    }

    if (navKey === "/identity-access/groups") {
      return <Groups onNavigate={setNavKey} onCreateGroup={() => setCreateGroupDrawerOpen(true)} />
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
        ) : navKey === "/identity-access/identities" ? (
          <div className="flex gap-3">
            <Button variant="outline" size="sm">Invite Users</Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setCreateGroupDrawerOpen(true)}>Create Group</Button>
          </div>
        ) : navKey === "/identity-access/groups" ? (
          <div className="flex gap-3">
            <Button variant="outline" size="sm">Import Groups</Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setCreateGroupDrawerOpen(true)}>Create Group</Button>
          </div>
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

      {/* Create Group Drawer */}
      <CreateGroupDrawer
        open={createGroupDrawerOpen}
        onOpenChange={setCreateGroupDrawerOpen}
      />
    </AppShellLayout>
  )
}
