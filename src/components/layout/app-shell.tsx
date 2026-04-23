import { Header } from "./header"
import { Sidebar } from "./sidebar"

interface AppShellProps {
  children?: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--input)]">
      <Header />
      <div className="flex h-[calc(100vh-56px)] mt-14">
        <Sidebar />
        <main className="flex-1 ml-48 bg-[var(--background)] overflow-auto border-l border-t border-[var(--border)] rounded-tl-xl">
          {children}
        </main>
      </div>
    </div>
  )
}
