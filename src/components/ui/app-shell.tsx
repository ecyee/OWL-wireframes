import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Modes the app shell can be in. Analogous to `SidebarProvider`'s
 * `open` / `collapsed` — a single enum that every surface in the
 * shell (sidebar, context pane, content pane) reads to decide what
 * to render and how to animate.
 *
 * - `focused`    — the default. Content pane holds the working
 *                  surface; context pane shows a thin summary strip
 *                  (project/branch + "Ask Anaconda" trigger);
 *                  sidebar shows app navigation.
 * - `conversing` — the user is talking to Anaconda. Content pane
 *                  slides out of view; context pane expands to the
 *                  full inset and becomes a chat surface; sidebar
 *                  swaps to the conversation list.
 *
 * See `docs/interaction-model.md` for the full interaction taxonomy.
 */
export type AppShellMode = "focused" | "conversing"

const APP_SHELL_KEYBOARD_SHORTCUT = "/"

interface AppShellContextValue {
  /** Current mode. */
  mode: AppShellMode
  /** Replace the mode. */
  setMode: (mode: AppShellMode) => void
  /** Flip between `focused` and `conversing`. */
  toggleMode: () => void
  /**
   * Key of the currently active nav item. Mirrors the `activeKey`
   * that `AppSidebar` / `AppShellLayout` already use so downstream
   * consumers (context-pane summary, conversation seed prompt) can
   * read a single source of truth.
   */
  activeKey?: string
}

const AppShellContext = React.createContext<AppShellContextValue | null>(null)

/**
 * Read the current app-shell state. Throws if used outside an
 * `AppShellProvider`.
 */
export function useAppShell() {
  const ctx = React.useContext(AppShellContext)
  if (!ctx) {
    throw new Error("useAppShell must be used within an AppShellProvider.")
  }
  return ctx
}

export interface AppShellProviderProps {
  /** Starting mode. Defaults to `focused`. */
  defaultMode?: AppShellMode
  /** Controlled mode value. */
  mode?: AppShellMode
  /** Called when the mode changes (either via props or shortcut). */
  onModeChange?: (mode: AppShellMode) => void
  /**
   * Currently active nav key. Optional — `AppShellLayout` forwards
   * it here so `ContextPaneSummary` and the conversation seed prompt
   * can read it without re-plumbing.
   */
  activeKey?: string
  /** Class merged onto the wrapper div. */
  className?: string
  children: React.ReactNode
}

/**
 * Holds app-shell-wide state (mode + active nav key) and installs a
 * global `/` keyboard shortcut that flips between `focused` and
 * `conversing`. Exposes a `data-mode` attribute on its wrapper so
 * descendant components can drive CSS transitions off of it.
 *
 * Pattern mirrors shadcn's `SidebarProvider`. Compose `AppShellProvider`
 * *outside* `SidebarProvider` — the app shell mode is the higher-order
 * state; sidebar open/collapsed is independent.
 */
export function AppShellProvider({
  defaultMode = "focused",
  mode: modeProp,
  onModeChange,
  activeKey,
  className,
  children,
}: AppShellProviderProps) {
  const [uncontrolledMode, setUncontrolledMode] =
    React.useState<AppShellMode>(defaultMode)
  const isControlled = modeProp !== undefined
  const mode = isControlled ? modeProp : uncontrolledMode

  const setMode = React.useCallback(
    (next: AppShellMode) => {
      if (!isControlled) setUncontrolledMode(next)
      onModeChange?.(next)
    },
    [isControlled, onModeChange]
  )

  const toggleMode = React.useCallback(() => {
    setMode(mode === "focused" ? "conversing" : "focused")
  }, [mode, setMode])

  // Global `/` shortcut to toggle. Ignored while the user is typing
  // in a form control so it doesn't fight with normal slash input.
  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== APP_SHELL_KEYBOARD_SHORTCUT) return
      const target = event.target as HTMLElement | null
      if (!target) return
      const tag = target.tagName.toLowerCase()
      if (
        tag === "input" ||
        tag === "textarea" ||
        target.isContentEditable ||
        tag === "select"
      ) {
        return
      }
      event.preventDefault()
      toggleMode()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [toggleMode])

  const value = React.useMemo<AppShellContextValue>(
    () => ({ mode, setMode, toggleMode, activeKey }),
    [mode, setMode, toggleMode, activeKey]
  )

  return (
    <AppShellContext.Provider value={value}>
      <div
        data-slot="app-shell"
        data-mode={mode}
        className={cn(
          "group/app-shell flex min-h-svh w-full",
          className
        )}
      >
        {children}
      </div>
    </AppShellContext.Provider>
  )
}
