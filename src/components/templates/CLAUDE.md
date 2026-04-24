# Templates

The three canonical templates that every screen in OWL must use.
They are the only blessed layouts — do not invent new page
layouts, and do not wrap shadcn `Sidebar`, `Sheet`, or onboarding
patterns outside these files.

This file is loaded automatically by Claude Code and Cowork when we
edit anything in this directory. Keep it current when templates
change, and keep
[`docs/interaction-model.md`](../../../docs/interaction-model.md) in
sync in the same PR.

**That document is the *why*** — surfaces, modes, motion, keyboard.
This file is the *how* — picker logic, API contracts, do/don't.

## The four surfaces, three templates

The interaction model names **four surfaces**:

1. **Onboarding** (persistent, first-run only) — the gated checklist
   the user sees before the app shell exists. Owned by
   `OnboardingLayout`.
2. **Context pane** (persistent) — the top strip inside the shell;
   swells into the full Ask-Anaconda NLUI in `conversing` mode.
3. **Content pane** (persistent) — the working surface; owns its
   own title header and page actions.
4. **Action sheet** (transient) — slides in from the right for
   record-level work.

Three templates compose these four surfaces:

- `OnboardingLayout` **is** the Onboarding surface.
- `AppShellLayout` owns the Context pane + the Content pane, wired
  together with the sidebar via `AppShellProvider`.
- `ActionSheet` is the transient; always mounted inside
  `AppShellLayout`'s `children`.

## Decision tree

```
Is the user authenticated AND has completed onboarding?
├── No  → OnboardingLayout
└── Yes → AppShellLayout
          Is this screen about taking action on a record
          (create / edit / delete-confirm)?
          ├── Yes → mount ActionSheet inside the children
          └── No  → render page content directly in AppShellLayout
```

Every screen resolves to exactly one of these. If it does not, that
is a team discussion — not a per-branch workaround.

---

## 1. `OnboardingLayout`

Gated multi-step checklist for **platform onboarding** only — the
one-time, first-run, pre-shell flow. Renders the Anaconda wordmark
above a centered card; the card shows a progress bar and a todo
list with check marks that fill in as steps complete.

> **Heads up: "platform onboarding" ≠ "setup flow".**
> This template is for *platform onboarding* — gated, before the
> shell exists. In-app step-by-step wizards (new perimeter, new
> integration, credential rotation) are *setup flows*; they use
> the same "Setup" button copy but ship inside `AppShellLayout`
> as an `ActionSheet` with internal steps. If you or Claude reach
> for `OnboardingLayout` for an in-app wizard, stop — build it as
> an `ActionSheet` instead.

- **shadcn provenance:** `Card` + `Progress` + `Button`, plus a
  local `ChecklistRow`.
- **Canonical uses:** first-run onboarding — today that is "connect
  cloud provider", "integrate auth", "create perimeters", but the
  template is data-driven.
- **Props:** see JSDoc in `OnboardingLayout.tsx`. Steps are passed
  as an array with `title`, `description`, `action` (the button that
  advances the step), optional inline `content`, and `isComplete`.
  `onComplete` fires once every step is complete — no explicit
  "Enter app" button.
- **Do:** keep each step's `action` to a single button that either
  completes the step directly (demo) or opens a real flow (product).
  Use all-caps consistent button copy like "Setup".
- **Don't:** use this template for non-gated multi-step flows. Use
  `ActionSheet` with internal steps for those. Don't add a step that
  cannot be completed programmatically — every step must be able to
  flip `isComplete` to true.

## 2. `AppShellLayout`

The post-onboarding surface. Composes **sidebar + context pane +
content pane** into a single cohesive shell, and owns the
`focused` ↔ `conversing` mode state via `AppShellProvider`.

- **shadcn provenance:** `SidebarProvider` + `AppSidebar` +
  `SidebarInset` from `sidebar-08`, plus our own additions:
  `AppShellProvider` (`ui/app-shell.tsx`), the pane primitives in
  `ui/context-pane.tsx` (`PaneStack`, `ContextPane`,
  `ContextPaneSummary`, `ContextPaneConversing`, `ContentPane`,
  `ContentPaneHeader`, `ContentPaneBody`), and the default summary /
  conversing faces defined locally.
- **Canonical uses:** every authenticated page.
- **Key props** (see JSDoc in `AppShellLayout.tsx`):
  - `title` — the large page title rendered in `ContentPaneHeader`.
  - `headerActions` — right-aligned slot in the content pane header
    (e.g. the "Manage" button).
  - `activeKey` / `onNavigate` — nav state contract; see below.
  - `contextSummary` / `contextConversing` — optional overrides for
    the context pane faces. Defaults render a sensible placeholder.
  - `defaultSidebarOpen` — forwarded to `SidebarProvider`.
- **Do:** put page content in `children`. Mount `ActionSheet` inside
  `children` so it layers over the content pane correctly.
- **Don't:** mount multiple `AppShellLayout`s on a single route.
  Don't replace the sidebar per-page — if two screens need
  different nav, that is an architecture decision, not a template
  one. Don't animate the content ↔ context transition in user code;
  `AppShellProvider` + CSS do that for you.
- **Providers bundled in:** `TooltipProvider`, `SidebarProvider`,
  `AppShellProvider`. Tooltips inside the shell work without setup.
- **Nav state contract:** the sidebar is a display component; it
  does not own the active-route state. Pass `activeKey` (the `url`
  of the active nav item) and `onNavigate` (called with an item's
  `url` when clicked). In a routed app, derive `activeKey` from the
  router and make `onNavigate` push to history.
- **Nav data contract:** all nav items are defined in
  `src/components/app-sidebar.tsx` under the exported `navData`
  object (two groups, `projects` and `platform` — the latter
  rendered as "Infrastructure" with Compute, Governance, Platform).
  Helpers `lookupNavTitle(key)` and `resolveNavSection(key)` are
  exported alongside so any surface can derive labels from an
  `activeKey` without duplicating data. Add or remove items there.
- **Perimeter switcher:** lives in the sidebar footer
  (`PerimeterSwitcher` in `app-sidebar.tsx`). Self-contained local
  state today; promote to app-level state when a real perimeter
  concept is wired.

## 3. `ActionSheet`

Right-side sheet for create / edit / delete-confirm. The name
describes the *user* concept ("take an action on this record"), not
the implementation ("CRUD").

- **shadcn provenance:** thin wrapper around `Sheet` (not `Dialog`).
  `Sheet` portals to the body so it always layers correctly.
- **Canonical uses:** edit-cluster, new-integration, member-permissions,
  destructive-confirm.
- **Props:** see JSDoc in `ActionSheet.tsx`. Controlled via `open`
  + `onOpenChange`; primary action via `onSubmit` (Promise-aware,
  shows disabled state while pending);
  `submitVariant="destructive"` for remove / delete flows.
- **Do:** use for anything record-level. Put the form in `children`
  and wire it to `onSubmit`.
- **Don't:** use `Dialog` for CRUD — we standardized on Sheet so
  users always know "side panel = record work". Don't nest an
  `ActionSheet` inside another — layer with page navigation instead.

---

## Composition rules

- **Onboarding → App.** Render `OnboardingLayout` at the root when
  onboarding is incomplete; once `onComplete` fires, unmount it and
  render `AppShellLayout`. Never render both simultaneously.
- **Actions in the App.** `ActionSheet` must be mounted inside
  `AppShellLayout`'s `children` (not as a sibling) so the shell is
  the visible context behind the sheet.
- **Conversing in the App.** The context pane's conversing NLUI is
  owned by `AppShellLayout`; pass your real chat surface via
  `contextConversing`. Don't mount a separate NLUI manually.
- **No custom wrappers.** If a screen needs something the templates
  don't offer, extend the template here rather than forking it in a
  page.

## Collaboration rules

Because three people plus Claude are prototyping on separate
branches, the templates are the stable contract.

- **Additive props only.** If you extend a template, add a new
  optional prop and default it; don't change existing signatures.
- **One PR per change to a template.** Keep review-surface small.
- **Update the docs in the same PR.** Both this file and
  `docs/interaction-model.md` when the change touches surfaces /
  modes / motion.
- **Talk before you fork.** If you are tempted to build a new
  template, that is the signal to raise it in chat first.

## When you edit a template

1. Update the JSDoc on the component — it is the API reference.
2. Update the relevant section above.
3. If the change touches the interaction model (surfaces, modes,
   animation, keyboard), update
   [`docs/interaction-model.md`](../../../docs/interaction-model.md)
   in the same PR.
4. Run `npm run build` — it type-checks + production-builds.

## shadcn references

- Sidebar block gallery: https://ui.shadcn.com/blocks/sidebar
  (`sidebar-08`; our usage is in `src/components/app-sidebar.tsx`
  and `src/components/nav-main.tsx`).
- Sheet docs: https://ui.shadcn.com/docs/components/sheet
- Card docs: https://ui.shadcn.com/docs/components/card
- Progress docs: https://ui.shadcn.com/docs/components/progress
