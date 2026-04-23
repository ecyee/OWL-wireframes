import { useState } from "react"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const [activeId, setActiveId] = useState("item-1")

  return (
    <aside className="fixed left-0 top-14 w-48 h-[calc(100vh-56px)] bg-[var(--input)] overflow-y-auto flex flex-col z-30">
      {/* Nav groups */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        <div>
          <h3 className="px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
            Eyebrow
          </h3>
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <button
                key={`item-${i}`}
                onClick={() => setActiveId(`item-${i}`)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  activeId === `item-${i}`
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
                    : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                )}
              >
                <Circle className="h-4 w-4" />
                <span>Nav item</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer links */}
      <div className="p-3 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
          <Circle className="h-4 w-4" />
          <span>Nav item</span>
        </button>
      </div>
    </aside>
  )
}
