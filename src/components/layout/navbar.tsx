import { ModeToggle } from "@/components/layout/mode-toggle"
import { Logo } from "./logo"
import { CommandMenu } from "./command-pallete"

export function Navbar() {
  return (
    <div className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <CommandMenu />
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
