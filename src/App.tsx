import { AppShell } from "@/components/layout/app-shell"

export default function App() {
  return (
    <AppShell>
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Main Content Area
        </h1>
        <p className="text-[var(--muted-foreground)] mt-2">
          This is the main content area. The layout is ready to go.
        </p>
      </div>
    </AppShell>
  )
}
