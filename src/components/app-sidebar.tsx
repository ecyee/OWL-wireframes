"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { useAppShell } from "@/components/ui/app-shell"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  CheckIcon,
  ChevronsUpDownIcon,
  MessageSquareIcon,
  PanelLeftIcon,
  PlusIcon,
  TerminalIcon,
} from "lucide-react"

// Custom Outerbounds nav icons, sourced from the OB-nav-icons
// asset set. Rendered via <img> because the SVGs have their own
// stroke colors that we want to preserve as the official brand
// treatment.
function NavIcon({ name }: { name: string }) {
  return <img src={`/brand/icons/${name}.svg`} alt="" className="size-4" />
}

// Exported so any surface that needs a human label for a given nav
// key (context-pane summary, breadcrumbs) can look it up without
// re-duplicating the data.
//
// Structure mirrors Outerbounds prototype-v4:
//   - `platform` ≈ prototype "Infrastructure" (Compute, Platform,
//     Admin), rendered under the `Platform` sidebar group.
//   - `projects` ≈ prototype "Project" (Overview, Assets,
//     Components), rendered under the `Projects` sidebar group.
// Both groups are hierarchical (collapsible with sub-items), which
// is why both use NavMain.
export const navData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    {
      title: "Overview",
      url: "/overview",
      icon: <NavIcon name="overview" />,
      isActive: true,
      items: [
        { title: "Deployments", url: "/overview/deployments" },
        { title: "Workflows", url: "/overview/workflows" },
      ],
    },
    {
      title: "Assets",
      url: "/assets",
      icon: <NavIcon name="assets" />,
      items: [
        { title: "Code", url: "/assets/code" },
        { title: "Data", url: "/assets/data" },
        { title: "Models", url: "/assets/models" },
      ],
    },
    {
      title: "Components",
      url: "/components",
      icon: <NavIcon name="components" />,
      items: [
        { title: "Runs", url: "/components/runs" },
        { title: "Events", url: "/components/events" },
      ],
    },
  ],
  platform: [
    {
      title: "Compute",
      url: "/compute",
      icon: <NavIcon name="compute" />,
      items: [
        { title: "Workloads", url: "/compute/workloads" },
        { title: "Task Queues", url: "/compute/task-queues" },
        { title: "Pools", url: "/compute/pools" },
        { title: "Cost Reports", url: "/compute/cost-reports" },
      ],
    },
    {
      title: "Governance",
      url: "/governance",
      icon: <NavIcon name="governance" />,
      items: [
        { title: "Policies", url: "/governance/policies" },
        { title: "Integrations", url: "/governance/integrations" },
        { title: "Perimeters", url: "/governance/perimeters" },
      ],
    },
    {
      title: "Platform",
      url: "/platform",
      icon: <NavIcon name="platform" />,
      items: [
        { title: "Workstations", url: "/platform/workstations" },
        { title: "Users", url: "/platform/users" },
        { title: "Billing", url: "/platform/billing" },
      ],
    },
  ],
}

// Mock recent conversations. In a real app this comes from the chat
// history store.
const recentConversations: Array<{ id: string; title: string }> = [
  { id: "c-latest", title: "Debugging the skyline-8b-turbo pipeline" },
  { id: "c-prev-1", title: "Why is the cluster drifting at night?" },
  { id: "c-prev-2", title: "Compare llama3-70b-sft versus mistral" },
  { id: "c-prev-3", title: "Summarize yesterday's deployment failures" },
  { id: "c-prev-4", title: "Design Engineering: pending reviews" },
]

/** Look up a nav item's human-readable title by its `url` key. */
export function lookupNavTitle(key: string | undefined): string | undefined {
  if (!key) return undefined
  for (const group of [navData.projects, navData.platform]) {
    for (const item of group) {
      if (item.url === key) return item.title
      const sub = item.items?.find((s) => s.url === key)
      if (sub) return sub.title
    }
  }
  return undefined
}

/**
 * Resolve which sidebar group the given nav key belongs to.
 * `platform` = Infrastructure-ish concerns; `projects` = the work
 * the user is doing inside a project.
 */
export function resolveNavSection(
  key: string | undefined
): "platform" | "projects" | "unknown" {
  if (!key) return "unknown"
  if (
    navData.projects.some(
      (i) => i.url === key || key.startsWith(i.url + "/")
    )
  ) {
    return "projects"
  }
  if (
    navData.platform.some(
      (i) => i.url === key || key.startsWith(i.url + "/")
    )
  ) {
    return "platform"
  }
  return "unknown"
}

export interface AppSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  activeKey?: string
  onNavigate?: (url: string) => void
  activeConversationId?: string
  onSelectConversation?: (id: string | "new") => void
}

export function AppSidebar({
  activeKey,
  onNavigate,
  activeConversationId,
  onSelectConversation,
  ...props
}: AppSidebarProps) {
  const { mode } = useAppShell()
  const { toggleSidebar } = useSidebar()
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Brand row doubles as the sidebar toggle. Clicking the
                thumbnail (or anywhere on the row) toggles the
                sidebar. Hovering the thumbnail swaps the Terminal
                glyph for a PanelLeft icon to cue the intent. */}
            <SidebarMenuButton
              size="lg"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <div className="group/brand-thumb relative flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TerminalIcon className="size-4 transition-opacity duration-150 group-hover/brand-thumb:opacity-0" />
                <PanelLeftIcon className="absolute inset-0 m-auto size-4 opacity-0 transition-opacity duration-150 group-hover/brand-thumb:opacity-100" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Sleep Science Inc.</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="relative">
        {/* Navigation view — visible in focused mode. */}
        <div
          data-slot="app-sidebar-nav-view"
          data-mode={mode}
          className={cn(
            "absolute inset-0 flex flex-col gap-2 overflow-auto",
            "transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "data-[mode=conversing]:pointer-events-none",
            "data-[mode=conversing]:opacity-0"
          )}
        >
          <NavMain
            label="Projects"
            items={navData.projects}
            activeKey={activeKey}
            onNavigate={onNavigate}
          />
          <NavMain
            label="Infrastructure"
            items={navData.platform}
            activeKey={activeKey}
            onNavigate={onNavigate}
          />
        </div>

        {/* Conversations view — visible in conversing mode. */}
        <div
          data-slot="app-sidebar-conversations-view"
          data-mode={mode}
          className={cn(
            "absolute inset-0 flex flex-col gap-2 overflow-auto",
            "transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "data-[mode=focused]:pointer-events-none",
            "data-[mode=focused]:opacity-0"
          )}
        >
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onSelectConversation?.("new")}
                >
                  <PlusIcon />
                  <span>New conversation</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Recent</SidebarGroupLabel>
            <SidebarMenu>
              {recentConversations.map((conv) => (
                <SidebarMenuItem key={conv.id}>
                  <SidebarMenuButton
                    isActive={activeConversationId === conv.id}
                    onClick={() => onSelectConversation?.(conv.id)}
                  >
                    <MessageSquareIcon />
                    <span className="truncate">{conv.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <PerimeterSwitcher />
      </SidebarFooter>
    </Sidebar>
  )
}

// Available perimeters. In a real app these come from the
// perimeters API / user's org membership.
const perimeters = [
  { id: "default", name: "Default" },
  { id: "production", name: "Production" },
  { id: "staging", name: "Staging" },
] as const

type PerimeterId = (typeof perimeters)[number]["id"]

/**
 * Sidebar-footer control that shows the active perimeter and lets
 * the user switch between them. Collapses to just the shield glyph
 * when the sidebar is in icon-only mode.
 */
function PerimeterSwitcher() {
  const [activeId, setActiveId] = React.useState<PerimeterId>("production")
  const active = perimeters.find((p) => p.id === activeId) ?? perimeters[0]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <NavIcon name="perimeter" />
              <span className="flex-1 truncate font-medium">
                {active.name}
              </span>
              <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={8}
          >
            {perimeters.map((p) => (
              <DropdownMenuItem
                key={p.id}
                onClick={() => setActiveId(p.id)}
              >
                <span className="flex-1">{p.name}</span>
                {p.id === activeId ? (
                  <CheckIcon className="size-4" />
                ) : null}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground">
              Configure perimeters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
