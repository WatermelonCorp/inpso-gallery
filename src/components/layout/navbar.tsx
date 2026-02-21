import { ModeToggle } from "@/components/layout/mode-toggle"
import { Logo } from "./logo"
import { CommandMenu } from "./command-pallete"

export function Navbar() {
  return (
    <div className="border-b border-border/60 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between border-x">
        <Logo />
        <div className="flex items-center gap-4">
          <CommandMenu />
          <ModeToggle />
        </div>
      </div>
      {/* Subtle accent line under navbar */}
      <div className="h-px bg-primary/10" />
    </div>
  )
}
