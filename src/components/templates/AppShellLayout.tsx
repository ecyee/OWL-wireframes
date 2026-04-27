import * as React from "react"

import {
  AppSidebar,
  lookupNavTitle,
  navData,
  resolveNavSection,
} from "@/components/app-sidebar"
import { AnacondaGlyph } from "@/components/ui/anaconda-glyph"
import { AppShellProvider, useAppShell } from "@/components/ui/app-shell"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ContentPane,
  ContentPaneBody,
  ContentPaneHeader,
  ContextPane,
  ContextPaneConversing,
  ContextPaneSummary,
  PaneStack,
} from "@/components/ui/context-pane"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  BellIcon,
  ChevronDownIcon,
  FolderIcon,
  GitBranchIcon,
  LogOutIcon,
  PanelLeftIcon,
  RocketIcon,
  TerminalIcon,
  Undo2Icon,
} from "lucide-react"

/**
 * Canonical post-onboarding surface.
 *
 * Composes four surfaces:
 *   - Sidebar         — app navigation (or the recent-conversation
 *                       list, in conversing mode).
 *   - Context pane    — a slightly smaller card at the top of the
 *                       inset, showing "where you are" (sidebar
 *                       toggle, project/branch, Ask Anaconda
 *                       prompt). Expands to the full pane in
 *                       conversing mode.
 *   - Content pane    — the main working card, owning its own
 *                       header (title + page actions) and a
 *                       scrollable body. Reads as the foreground
 *                       card in focused mode; slides off in
 *                       conversing mode.
 *   - Action sheet    — transient; mounted inside `children` as
 *                       `ActionSheet` on demand.
 *
 * The shell has two modes, owned by `AppShellProvider`:
 *   - `focused`    — content pane on top; context pane is the small
 *                    summary strip at the top of the pane stack.
 *   - `conversing` — content pane slid off; context pane filled
 *                    with the NLUI; sidebar forced open and showing
 *                    the conversation list.
 *
 * Pressing `/` anywhere (outside a form control) toggles the mode.
 */
export interface AppShellLayoutProps {
  /** Main content of the page (rendered inside the content pane body). */
  children: React.ReactNode
  /**
   * Large page title shown in the content pane's header. Pass a
   * string or a React node (e.g. a title + a count badge).
   */
  title?: React.ReactNode
  /** Right-aligned slot in the content pane's header for page actions. */
  headerActions?: React.ReactNode
  /** Whether the sidebar starts open. Defaults to `true`. */
  defaultSidebarOpen?: boolean
  /**
   * URL/key of the currently active nav item. Drives sidebar
   * highlighting and the default context-pane summary.
   */
  activeKey?: string
  /**
   * Called when a nav item is clicked. The app is expected to
   * update its own active-route state and swap `children`.
   */
  onNavigate?: (url: string) => void
  /**
   * Override the context-pane summary (the focused-mode strip).
   */
  contextSummary?: React.ReactNode
  /**
   * Content for the conversing-mode NLUI. Typically a chat message
   * list + composer. Defaults to a placeholder.
   */
  contextConversing?: React.ReactNode
}

export function AppShellLayout({
  children,
  title,
  headerActions,
  defaultSidebarOpen = true,
  activeKey,
  onNavigate,
  contextSummary,
  contextConversing,
}: AppShellLayoutProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden">
      <AppShellProvider activeKey={activeKey}>
        <TooltipProvider delayDuration={200}>
          <SidebarProvider defaultOpen={defaultSidebarOpen}>
            <SidebarModeSync />
            <AppSidebar activeKey={activeKey} onNavigate={onNavigate} />
            <SidebarInset
              // Strip the default `SidebarInset` card chrome (bg +
              // rounded + shadow). Our two inner cards (ContextPane
              // and ContentPane) are the only visible cards.
              className="bg-transparent md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none h-full"
            >
              <PaneStack className="h-full">
                <ContextPane>
                  <ContextPaneSummary>
                    {contextSummary ?? <DefaultContextSummary onNavigate={onNavigate} />}
                  </ContextPaneSummary>
                  <ContextPaneConversing>
                    {contextConversing ?? <DefaultContextConversing />}
                  </ContextPaneConversing>
                </ContextPane>
                <ContentPane>
                  <ContentPaneHeader>
                    {title && (
                      <h1 className="text-xl font-semibold tracking-tight text-foreground">
                        {title}
                      </h1>
                    )}
                    {headerActions && (
                      <div className="ml-auto flex items-center gap-2">
                        {headerActions}
                      </div>
                    )}
                  </ContentPaneHeader>
                  <ContentPaneBody>{children}</ContentPaneBody>
                </ContentPane>
              </PaneStack>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </AppShellProvider>
    </div>
  )
}

/** Keeps the sidebar open in conversing mode. */
function SidebarModeSync() {
  const { mode } = useAppShell()
  const { setOpen } = useSidebar()
  React.useEffect(() => {
    if (mode === "conversing") setOpen(true)
  }, [mode, setOpen])
  return null
}


/**
 * Default context-pane summary: Ask Anaconda prompt.
 */
function DefaultContextSummary({ onNavigate }: { onNavigate?: (url: string) => void }) {
  const { mode, setMode } = useAppShell()

  return (
    <div className="flex h-full w-full items-stretch">
      {/* ACME CORP organization info */}
      <div className="flex items-center gap-3 px-3 text-sm text-muted-foreground">
        <div className="flex aspect-square size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <TerminalIcon className="size-3" />
        </div>
        <span className="font-medium text-foreground">ACME CORP</span>
      </div>

      {/* Flexible spacer — pushes Ask Anaconda to the right edge. */}
      <div className="flex-1" />

      {/* Right-aligned mode control. In focused mode this is the
          entry point ("Ask Anaconda…") — in conversing mode it
          becomes the way back out ("Return to dashboard"). Same
          slot, same keyboard hint, so the mode toggle has one
          consistent home. */}
      {mode === "focused" ? (
        <button
          type="button"
          onClick={() => setMode("conversing")}
          className="group flex w-80 items-center gap-2 border-l px-3 text-left transition-colors hover:bg-accent/50"
        >
          <AnacondaGlyph className="size-4 text-foreground" />
          <span className="flex-1 text-sm text-muted-foreground group-hover:text-foreground">
            Ask Anaconda…
          </span>
          <kbd className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            /
          </kbd>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setMode("focused")}
          className="group flex w-80 items-center gap-2 border-l px-3 text-left transition-colors hover:bg-accent/50"
        >
          <Undo2Icon className="size-4 text-muted-foreground group-hover:text-foreground" />
          <span className="flex-1 text-sm text-muted-foreground group-hover:text-foreground">
            Return to dashboard
          </span>
          <kbd className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            /
          </kbd>
        </button>
      )}

      {/* Profile dropdown next to Ask Anaconda */}
      <ContextUserMenu onNavigate={onNavigate} />
    </div>
  )
}

/**
 * Default conversing-mode content: a placeholder NLUI surface.
 */
function DefaultContextConversing() {
  const { setMode } = useAppShell()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <AnacondaGlyph className="size-10 text-foreground" />
      <div className="text-center">
        <h2 className="text-lg font-medium text-foreground">
          Ask Anaconda anything
        </h2>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          This is where the NLUI goes — pass your own chat surface
          via <code>contextConversing</code>. Press{" "}
          <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            /
          </kbd>{" "}
          to return to the app.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={() => setMode("focused")}>
        Close
      </Button>
    </div>
  )
}

/**
 * Compact user-avatar menu for the context-pane summary. Replaces
 * the full `NavUser` row that used to live in the sidebar footer —
 * only the circular avatar is shown; the name and email are
 * exposed inside the dropdown.
 */
function ContextUserMenu({ onNavigate }: { onNavigate?: (url: string) => void }) {
  const user = navData.user
  // 2-letter initials fallback. The stock `/avatars/shadcn.jpg`
  // URL doesn't exist in public/, so we skip AvatarImage entirely
  // to avoid the Radix fallback-delay flicker between open states.
  const initials = user.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account menu for ${user.name}`}
          className="flex items-center justify-center border-l px-2.5 outline-none transition-colors hover:bg-accent/50 data-[state=open]:bg-accent focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          {/* Black circle + white initials gives the avatar enough
              weight to read as a distinct section next to the Ask
              Anaconda button, rather than a grey dot in a grey row. */}
          <Avatar className="size-7">
            <AvatarFallback className="bg-foreground text-background font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-foreground text-background font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <RocketIcon />
            Onboarding
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate?.("/notifications")}>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onNavigate?.("/org-settings")}>
            <FolderIcon />
            Org Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GitBranchIcon />
            User Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <TerminalIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RocketIcon />
            Licenses
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}