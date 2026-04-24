# OWL wireframes — project guide

A React + TypeScript wireframe prototype for the **OWL / Anaconda**
surface, built on shadcn/ui with a greyscale Tailwind theme. The
goal is rapid, cohesive prototyping: a small team plus Claude can
explore three or four different ideas in parallel without the app
drifting apart visually or structurally.

## Who this is for

Three humans work on this repo, each paired with Claude:

- Every contributor prototypes on their own branch off `main`.
- The *shape of the app* — the surfaces, the animation language, the
  keyboard shortcuts, the templates — is shared. We agree on those in
  `main` and inherit them on every branch.
- The *ideas* — new pages, new flows, new nav items — are per-branch.
  Pick a template, drop your content in, iterate.

This only works if everyone stays inside the shared scaffolding.
That is what the files in this repo are designed to enforce.

## Tech stack

- React 19 + TypeScript
- Vite 5
- Tailwind CSS 4 (`@theme inline` in `src/index.css`; no `tailwind.config.ts` content to speak of)
- shadcn/ui (radix-luma style) components
- Radix primitives (`radix-ui` umbrella package)
- lucide-react icons
- tailwind-merge + clsx via `cn()` in `src/lib/utils.ts`

No ESLint, no test runner, no state library — deliberately minimal.

## Project structure

```
public/
├── favicon.svg                  Anaconda glyph (links from index.html).
└── brand/                       Canonical Anaconda / Outerbounds assets.
    ├── anaconda-logo.svg        Wordmark.
    ├── anaconda-glyph.svg       Glyph only (the leaf-like shape).
    └── icons/                   Nav icons, one SVG per nav item.

docs/
└── interaction-model.md         The "why" — surfaces, modes, motion.

src/
├── App.tsx                      Demo harness. Onboarding gate → shell.
├── main.tsx                     Vite entry.
├── index.css                    Theme tokens + custom keyframes.
├── components/
│   ├── templates/               The blessed screens. Read this folder's CLAUDE.md.
│   │   ├── OnboardingLayout.tsx
│   │   ├── AppShellLayout.tsx
│   │   ├── ActionSheet.tsx
│   │   ├── index.ts
│   │   └── CLAUDE.md
│   ├── ui/                      shadcn/ui primitives + our three extensions:
│   │   │                        app-shell.tsx, context-pane.tsx, anaconda-glyph.tsx
│   │   └── …
│   ├── app-sidebar.tsx          Nav data (navData), AppSidebar, PerimeterSwitcher.
│   └── nav-main.tsx             Collapsible nav group used by AppSidebar.
├── hooks/use-mobile.ts
└── lib/utils.ts                 `cn()` — tailwind-merge + clsx.
```

## Templates — the team convention

Every screen lives inside exactly one of three templates under
`src/components/templates/`:

1. **`OnboardingLayout`** — the gated first-run checklist. Blocks
   access to the app until every step is complete.
2. **`AppShellLayout`** — the post-onboarding surface. Composes
   **four surfaces** (sidebar, context pane, content pane, action
   sheet) in a fixed relationship and owns the `focused` ↔
   `conversing` mode state.
3. **`ActionSheet`** — transient right-side sheet, mounted inside
   `AppShellLayout`'s `children`. For create / edit / delete-confirm.

**Decision tree and API details live in
[`src/components/templates/CLAUDE.md`](./src/components/templates/CLAUDE.md).**
Claude Code and Cowork load that file automatically when you edit
anything in that folder.

**The *why* — the four surfaces, the two modes, the motion language,
the keyboard shortcuts — lives in
[`docs/interaction-model.md`](./docs/interaction-model.md).** Read
that before you add a screen, introduce a new surface, or change how
surfaces relate.

Do not hand-roll new page layouts. If a screen does not fit a
template, that is a team discussion, not a per-branch workaround.

## Commands

- `npm run dev` — Vite dev server.
- `npm run build` — type-check (`tsc -b`) then production build.
- `npm run preview` — preview the production build.

## Adding shadcn components

Use the shadcn CLI. It handles registry fetch, component placement,
and imports.

```
npx shadcn@latest add <component>       # e.g. dialog, tabs, command
npx shadcn@latest add <block>           # e.g. dashboard-01
```

Primitives land in `src/components/ui/`; blocks may drop additional
files at `src/components/`. Prefer composition inside
`src/components/templates/` over forking a primitive.

## Theme

- All design tokens are CSS variables in `src/index.css`, mapped to
  Tailwind utilities through an `@theme inline` block.
- Hues are all neutral grey (`hsl(0 0% …)`) so the app reads as a
  monochrome wireframe and shadcn blocks installed from the registry
  theme correctly.
- To retune the palette, edit the HSL values in `:root` (light) and
  `.dark`. Do **not** change the `@theme inline` mapping.
- Do **not** use arbitrary-value syntax (`bg-[var(--primary)]`);
  stick to token utilities (`bg-primary`, `text-muted-foreground`,
  `border-border`).
- The `--radius` value is flattened across every radius token so
  tweaking it alone updates the whole app.

## Collaboration protocol

- **Branch per idea.** Never prototype on `main`. Name branches after
  the idea: `perimeters-picker`, `models-detail-v2`, `workloads-empty-state`.
- **Template first.** Before you write a page, pick a template and
  check its CLAUDE.md. If your idea does not fit, raise it in the
  team chat — do not fork.
- **Nav changes touch shared files.** `navData` in `app-sidebar.tsx`
  is shared. If you need a nav item for your branch only, add it
  locally; if it is a real product direction, open a PR to `main`.
- **Update the docs in the same PR** that changes a template or the
  interaction model. Stale docs are worse than missing docs —
  Claude reads them and follows them.
- **Keep diffs focused.** One idea per branch, one surface change
  per PR where possible.

## Notes

- `src/index.css` defines custom keyframes (`owl-slide-in-from-right`
  etc.) and custom variants (`data-open`, `data-closed`) for Radix
  `data-state` attributes. The base Tailwind install has no
  animation library; every animation you see is explicit.
- Keyboard shortcuts that ship with the shell:
  - `/` toggles focused ↔ conversing mode (the Ask Anaconda NLUI).
  - `Cmd+.` / `Ctrl+.` toggles the sidebar.
