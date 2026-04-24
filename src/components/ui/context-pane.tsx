import * as React from "react"

import { cn } from "@/lib/utils"
import { useAppShell } from "@/components/ui/app-shell"

/**
 * The persistent "shadow pane" that always sits beneath the content
 * pane inside `SidebarInset`. It has two faces, one per app-shell
 * mode:
 *
 * - `focused`    — renders only `ContextPaneSummary` (a thin strip
 *                  with the sidebar toggle, project/branch, and
 *                  "Ask Anaconda" prompt). The context card is
 *                  deliberately narrower and shorter than the
 *                  content pane so the content pane reads as the
 *                  foreground card.
 * - `conversing` — hides the summary and renders
 *                  `ContextPaneConversing` full-height (the
 *                  Claude-Code-style NLUI). The context card grows
 *                  to fill the whole `PaneStack`.
 *
 * When mode flips, the context card animates from narrow+short to
 * filling the full `PaneStack`, and the content pane translates
 * down off the bottom. Both use the same cubic-bezier easing so
 * they feel like a single "shuffle of cards".
 */

const TRANSITION = "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"

/**
 * Relative container that owns the z-axis stack. No chrome of its
 * own — the two inner cards are the only visible cards.
 */
export function PaneStack({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pane-stack"
      className={cn(
        "relative flex-1 overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

/**
 * Outer context-pane card. A slightly darker grey than the content
 * pane so it reads as the background layer in focused mode. Its
 * position animates between a short top strip (focused) and the
 * full pane (conversing).
 *
 * - Focused:    `top-2 left-4 right-4 bottom-[calc(100%-5rem)]`
 *               — 8px from top, 16px from sides, ~72px tall, of
 *               which only the top 48px is visible (the lower 24px
 *               tucks behind the content pane).
 * - Conversing: `inset-0` — fills the PaneStack.
 */
export function ContextPane({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  const { mode } = useAppShell()
  return (
    <section
      data-slot="context-pane"
      data-mode={mode}
      className={cn(
        TRANSITION,
        "absolute z-0 flex flex-col overflow-hidden rounded-lg border bg-muted shadow-sm",
        "data-[mode=focused]:top-2",
        // Left inset is intentionally larger than the right so the
        // context card reads as narrower than the content pane —
        // while the right edge stays pinned so the profile avatar
        // (and its dropdown) open in a stable position.
        "data-[mode=focused]:left-4",
        "data-[mode=focused]:right-2",
        "data-[mode=focused]:bottom-[calc(100%-5rem)]",
        "data-[mode=conversing]:inset-0",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

/**
 * Focused-mode face of the context pane: the content of the thin
 * strip. Laid out as sections divided by vertical lines (sidebar
 * toggle, project/branch, Ask Anaconda prompt).
 *
 * Stays visible in `conversing` mode too — the project/branch
 * picker and profile avatar remain so the user can still see
 * "where they are" while talking to Anaconda. The mode-aware
 * summary is expected to hide any pieces that are redundant in
 * conversing (e.g. the Ask Anaconda button itself).
 */
export function ContextPaneSummary({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { mode } = useAppShell()
  return (
    <div
      data-slot="context-pane-summary"
      data-mode={mode}
      className={cn(
        TRANSITION,
        // Fixed 48px height — sits at the top of the context pane
        // card. The context pane is taller (72px) so that its lower
        // 24px tucks behind the content pane.
        "flex h-12 shrink-0 items-stretch",
        // In conversing mode the strip picks up a bottom border so
        // it reads as a separate header from the chat surface
        // below.
        "data-[mode=conversing]:border-b",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Conversing-mode face of the context pane: the Claude-Code-style
 * NLUI. Hidden in `focused` mode, grows to fill the pane in
 * `conversing` mode.
 */
export function ContextPaneConversing({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { mode } = useAppShell()
  return (
    <div
      data-slot="context-pane-conversing"
      data-mode={mode}
      className={cn(
        TRANSITION,
        "flex min-h-0 flex-col overflow-hidden",
        "data-[mode=focused]:pointer-events-none",
        "data-[mode=focused]:h-0",
        "data-[mode=focused]:opacity-0",
        "data-[mode=conversing]:flex-1",
        "data-[mode=conversing]:opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * The user's working surface — a rounded card that sits on top of
 * the context pane in focused mode (flush against the summary
 * strip so the context card's rounded bottom corners tuck behind
 * it) and translates off the bottom in conversing mode so the
 * context pane takes over.
 *
 * A `ContentPane` owns its own header — it is a self-contained
 * card. Compose with `ContentPaneHeader` (title + page actions)
 * and `ContentPaneBody` (scrollable page content):
 *
 * ```tsx
 * <ContentPane>
 *   <ContentPaneHeader>
 *     <h1 className="text-xl font-semibold">Models</h1>
 *     <div className="ml-auto">{headerActions}</div>
 *   </ContentPaneHeader>
 *   <ContentPaneBody>{page}</ContentPaneBody>
 * </ContentPane>
 * ```
 */
export function ContentPane({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { mode } = useAppShell()
  return (
    <div
      data-slot="content-pane"
      data-mode={mode}
      className={cn(
        TRANSITION,
        "absolute inset-x-0 bottom-0 z-10 flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm",
        "data-[mode=focused]:top-14",
        "data-[mode=focused]:translate-y-0",
        "data-[mode=focused]:opacity-100",
        "data-[mode=conversing]:top-0",
        "data-[mode=conversing]:translate-y-full",
        "data-[mode=conversing]:opacity-0",
        "data-[mode=conversing]:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Header slot of `ContentPane`. Taller than the context strip so
 * the page title can feel like a page title. Put a large heading
 * and any page-level actions here.
 */
export function ContentPaneHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="content-pane-header"
      className={cn(
        "flex h-16 shrink-0 items-center gap-3 border-b px-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * Body slot of `ContentPane`. Scrollable. Put the page's actual
 * content here (cards, tables, lists, forms).
 */
export function ContentPaneBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-pane-body"
      className={cn(
        "flex flex-1 flex-col gap-4 overflow-auto p-4 md:p-6",
        className
      )}
      {...props}
    />
  )
}
