# OWL interaction model

This document is the *why* behind the templates in
`src/components/templates/`. It names the surfaces, the modes, the
motion, and the keyboard language that make OWL feel like one app
rather than a bag of shadcn components.

When you add a screen, read this first. When you change a template,
update this document in the same PR.

---

## Who this is for

Three humans are prototyping OWL in parallel, each paired with
Claude. Each idea lives on its own branch off `main`. The app
surfaces and motion defined below are **shared contracts** —
agreed on `main`, inherited by every branch. Ideas differ between
branches; the shell does not.

The templates enforce the shell. This document tells you why the
shell looks the way it does, so you can reuse it without re-deriving
it — and so that when two branches come back to `main`, their work
composes.

---

## The four surfaces

OWL has exactly four surfaces. Three are **persistent** — always on
screen once the user has made it past onboarding, always composed in
the same relationship. One is **transient** — it appears on demand
to capture an action.

### 1. Platform onboarding (gated, first-run)

The only screen the user sees before the shell exists. A centered
card with a progress bar and a checklist of required steps, plus
the **Anaconda wordmark above the card** as the platform brand
header. Every step has a button labelled "Setup" that either opens
a real flow (in product) or flips `isComplete` (in wireframes).
When every step reports complete, `onComplete` fires and the root
swaps in `AppShellLayout` — no explicit "Enter app" button.

Steps today are Connect cloud provider, Integrate auth, Create
perimeters. The template is data-driven, so the list is a detail —
the *shape* (gated, checklist, automatic transition) is the thing.

Owned by `OnboardingLayout`. Never mounted alongside `AppShellLayout`.

> **Vocabulary note — "platform onboarding" vs. "setup flows".**
> *Platform onboarding* is specifically the first-run, pre-shell,
> gated checklist this template owns. It is a one-time thing that
> bootstraps the whole org into the app.
>
> *Setup flows* are the in-app, step-by-step configuration wizards
> that live **inside** `AppShellLayout` — creating a new perimeter,
> wiring up a new integration, rotating a credential. They look
> similar (stepped, with "Setup" copy), but they are a different
> surface: they open in an `ActionSheet`, they are not gated, and
> they do not replace the shell.
>
> If you catch yourself (or Claude) reaching for `OnboardingLayout`
> for an in-app wizard, stop — build it as an `ActionSheet` with
> internal steps instead. Conversely, don't pack setup-flow logic
> into `OnboardingLayout`; it is reserved for the first-run gate.

### 2. Sidebar (persistent, left)

shadcn `Sidebar` (variant `inset`, collapsible `icon`). Two faces,
cross-faded based on the shell's mode:

- **Nav face** (`focused`) — application navigation in two groups:
  - **Projects** — the user's work: Overview (Deployments, Workflows),
    Assets (Code, Data, Models), Components (Runs, Events).
  - **Infrastructure** — org-level concerns: Compute (Workloads, Task
    Queues, Pools, Cost Reports), Governance (Policies, Integrations,
    Perimeters), Platform (Workstations, Users, Billing).
- **Conversations face** (`conversing`) — the recent-Anaconda
  conversation list plus a "New conversation" trigger. Matches the
  pattern in Claude's own UI.

The sidebar header shows the organization identity (today "Sleep
Science Inc."); the sidebar footer shows the **Perimeter switcher**,
a dropdown that lets the user flip between Default, Production, and
Staging. Default perimeter is Production.

Keyboard: **Cmd+.** / Ctrl+. toggles the sidebar. The shortcut is
inherited from shadcn's `SidebarProvider`; the key is tuned in
`src/components/ui/sidebar.tsx` (`SIDEBAR_KEYBOARD_SHORTCUT`).

### 3. Context pane (persistent, top)

A shadow surface that always sits beneath the content pane inside
`SidebarInset`. This is where the app *situates* what the user is
doing. Like the sidebar, it has two faces:

- **Summary** (`focused`) — a thin strip across the top edge of the
  content area (48 px tall; card is 72 px so the lower 24 px tucks
  behind the content pane for a layered look). Reading left to
  right:
  - Sidebar toggle.
  - Project / branch display (or "Your platform" when in the
    Infrastructure section).
  - Flexible spacer.
  - **Ask Anaconda** button — Anaconda glyph, "Ask Anaconda…"
    placeholder, and a bordered `/` key hint.
  - Profile avatar — opens the user menu (Onboarding, Notifications,
    Log out).
- **Conversing** (`conversing`) — the summary strip stays visible at
  the top (sidebar toggle + project/branch + avatar remain; the Ask
  Anaconda button is replaced by the composer below), and the pane
  grows to fill the full inset with the NLUI (chat messages +
  composer).

Geometry: `top-2 left-4 right-2` in focused mode. The left inset is
intentionally larger than the right so the context card reads as
narrower than the content pane; the right edge stays pinned so the
profile avatar and its dropdown open in a stable position regardless
of layout changes.

### 4. Content pane (persistent, main card)

The user's working surface. Positioned above the context pane in
z-order so it reads as the "top card" in focused mode.

**Self-contained.** Owns its own header *and* body — there is no
separate shell header above it. Internal structure (see
`src/components/ui/context-pane.tsx`):

- `ContentPaneHeader` — fixed 64 px; displays the large page `title`
  (left) and `headerActions` (right, via `ml-auto`). The header
  title is the page title, rendered as `text-xl font-semibold`.
- `ContentPaneBody` — scrollable; receives `children` from
  `AppShellLayout`.

Standard page action copy is "Manage" for the primary action that
opens an `ActionSheet`.

In `conversing` mode the whole content pane — header + body — slides
off the bottom as a single card (`translate-y-full` + fade) while
the context pane grows to cover the vacated space.

### Transient: Action sheet (right-side)

A shadcn `Sheet` (side `right`) that slides in over the content
pane. Always mounted inside `AppShellLayout`'s `children` so it
portals to the body and layers correctly.

Named `ActionSheet` because the user-visible concept is "take an
action on this record", not the implementation-centric "CRUD".

Use for create, edit, or delete-confirm. Use
`submitVariant="destructive"` for delete flows. Don't nest action
sheets — if a flow is multi-step, switch body content in place.

---

## App-shell modes

The shell has one piece of state, owned by `AppShellProvider`
(`src/components/ui/app-shell.tsx`): a `mode` enum with two values.

| Mode         | Sidebar face        | Content pane                              | Context pane                              |
| ------------ | ------------------- | ----------------------------------------- | ----------------------------------------- |
| `focused`    | Nav                 | Visible, filling the pane below the strip | Summary strip at top; rest behind content |
| `conversing` | Recent conversations | Slid offscreen (`translate-y-full`, fade) | Summary strip at top + full NLUI beneath  |

### Transitions

- `/` anywhere outside a form control toggles the mode.
  (`AppShellProvider` installs the listener; inputs/textareas/
  contenteditable are excluded.)
- Clicking "Ask Anaconda…" in the summary strip sets
  `mode=conversing`.
- The close control in the NLUI (and `/` again) returns to `focused`.

---

## Motion language

Every surface involved in a mode change animates with the same
easing and timing so the whole shell feels like a single motion —
the "shuffle of cards".

**All durations are 200 ms, `ease-linear` or `cubic-bezier(0.32,
0.72, 0, 1)`**, inherited from the sidebar. Keeping the weight
consistent is what makes the app read as one object rather than as
independent components with their own defaults.

| Moment                                      | Duration | Easing                         |
| ------------------------------------------- | -------- | ------------------------------ |
| Sidebar expand / collapse                   | 200 ms   | `ease-linear`                  |
| Sidebar face cross-fade (nav ↔ conversations) | 300 ms | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Pane shuffle (content ↔ context)            | 500 ms   | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Action sheet slide-in                       | 200 ms   | `ease-linear`                  |
| Action sheet slide-out                      | 200 ms   | `ease-linear`                  |
| Overlay fade (underneath action sheet)      | 200 ms   | `ease-linear`                  |

The action sheet and the sidebar are tuned to the same 200 ms /
linear pair because they belong to the same "pushed from the edge"
family. The pane shuffle is longer (500 ms) and slightly curved
because it moves more geometry at once; still the same easing
family.

### How it is implemented

- **Data attributes, not JS.** All visibility and transform are
  driven by `data-mode="focused"|"conversing"` on each surface, set
  from `useAppShell()`. No imperative animation code.
- **Keyframes in `src/index.css`.** The stock Tailwind install has
  no animation plugin; we define `@keyframes owl-slide-in-from-*`,
  `owl-slide-out-to-*`, `owl-fade-in`, and `owl-fade-out` ourselves.
- **Custom variants in `src/index.css`.** Radix sets
  `data-state="open"|"closed"` on primitives; we expose
  `data-open:` and `data-closed:` variants via `@custom-variant`.
- **`--radius` is flattened** across every radius token in
  `@theme inline`, so tuning it once updates every rounded corner.

---

## Navigation model

Nav data lives in `src/components/app-sidebar.tsx` as the exported
`navData` object. Each item has a stable `url` used as its key.

- `AppShellLayout` accepts `activeKey: string` and
  `onNavigate: (url) => void`. The sidebar calls `onNavigate(url)`;
  the consumer updates its state; both the active-item highlight and
  the default context-pane summary derive from `activeKey`.
- In a routed app (react-router, TanStack Router, Next.js) replace
  the `useState` with the router's location hook.

Two helpers are exported alongside `navData` so any surface can
derive labels without duplicating data:

- `lookupNavTitle(key)` — human title for a given `url`.
- `resolveNavSection(key)` — `"platform" | "projects" | "unknown"`.

### Project / branch display

The context-pane summary's left side shows the user's current
project / branch (`ob_project_starter` / `main`) when the active
nav key is in the Projects section, or "Your platform" when it is
in the Infrastructure section. Today this is a static display; a
richer picker (prototyped from prototype-v4) was reverted after a
Radix pointer-events regression. The current shape leaves room for
the picker to be reintroduced behind the same visual affordance.

---

## Platform onboarding

Implemented by `OnboardingLayout`. Before the shell ever renders,
the user sees the Anaconda wordmark above a centered card with a
checklist of required steps. Each step reports
`isComplete: boolean`. When every step reports complete,
`onComplete` fires and the consumer unmounts onboarding and mounts
`AppShellLayout`.

- No explicit "Enter app" button. The transition is automatic so
  the user does not have a moment of "I'm done but nothing
  happened".
- Each step's `action` slot is the only affordance — standard
  copy is "Setup". If a step needs a full form, open it in an
  `ActionSheet` rather than inlining.
- Progress indicator (`Progress`) and "N of M complete" counter
  render inline above the checklist.

**Not to be confused with setup flows.** Platform onboarding is the
one-time, gated, pre-shell surface. In-app setup wizards (new
perimeter, new integration, credential rotation) are *setup flows*
— they live inside `AppShellLayout` and ship as `ActionSheet`s with
internal steps. Same "Setup" button copy, completely different
surface. See the vocabulary note under "Platform onboarding" in the
surfaces section.

---

## Action-sheet flows

`ActionSheet` is the only right-side surface the app uses.

- Always mount inside `AppShellLayout`'s `children` so the sheet
  portals relative to the correct document and layers over the
  content pane cleanly.
- Use `submitVariant="destructive"` for delete / remove flows.
- Don't compose `ActionSheet` inside `ActionSheet` — for multi-step,
  switch the body content of the same sheet.
- Don't use shadcn `Dialog` for record work — we standardized on
  "side panel = record work". `AlertDialog` is fine for destructive
  confirms nested inside an `ActionSheet`.

---

## Keyboard surface

Two shortcuts ship with the shell:

- `/` — toggles `focused` ↔ `conversing` mode (Ask Anaconda).
  Ignored inside inputs, textareas, and contenteditable.
- `Cmd+.` / `Ctrl+.` — toggles the sidebar.

---

## Collaboration model

Because three branches prototype different ideas in parallel, the
shell is the place where everyone aligns. Rules that keep the shell
stable:

1. **Props are additive.** If you extend a template, add an optional
   prop and default it; don't change existing signatures.
2. **Nav data is shared.** `navData` in `app-sidebar.tsx` is a
   single source of truth. Branch-local nav items are fine for a
   prototype; real product directions go to `main`.
3. **Motion is shared.** The durations and easings in the table
   above are contract, not suggestion. Don't introduce new timing
   curves in a branch.
4. **Keyboard is shared.** Don't add new global shortcuts in a
   branch; coordinate on `main`.
5. **Docs travel with code.** When a template changes, update both
   `src/components/templates/CLAUDE.md` (the API reference) and
   this document (the why) in the same PR.

If two branches both need to extend the shell in the same place,
that is a signal to merge up to `main` first.

---

## Open calls / defaults

Decisions made during the current pass; revisit any if they don't
match product intent.

1. **The content pane owns its own header.** Title + header actions
   are inside `ContentPaneHeader`, which lives inside `ContentPane`.
   No separate "shell header" — the header moves with the content
   pane during the mode shuffle.
2. **Content pane translates fully off-screen when conversing** —
   no thumbnail or "peek" of the page behind. Matches Claude Code.
3. **Ask Anaconda is contextual.** `AppShellProvider` tracks
   `activeKey`; when the NLUI is wired to a real backend, pass
   `activeKey` through `contextConversing` to seed the conversation
   with "the page the user was on when they asked".
4. **The context strip is the top edge of the content area**, not a
   bottom dock. That makes the shuffle natural — content slides
   down into the void that the strip grew from.
5. **Perimeter switching is sidebar-footer scoped for now.** When a
   real perimeter concept is wired, promote the state out of
   `PerimeterSwitcher` to an app-level provider and expose it to
   pages.
