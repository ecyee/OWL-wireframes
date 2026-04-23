import { Menu, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[var(--input)] flex items-center justify-between px-4 z-40">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-[var(--primary)]" />
          <span className="font-semibold text-sm">Anaconda</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="h-5 w-5" />
        </Button>
        <div className="w-px h-6 bg-[var(--border)]" />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
