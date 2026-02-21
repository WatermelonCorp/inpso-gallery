import { HorizontalLine } from "./line"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon, NewTwitterIcon } from "@hugeicons/core-free-icons"

export function Footer() {
  return (
    <div className="border-t border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="border-x h-10 w-full max-w-7xl mx-auto border-border/60"></div>
      {/* Accent line above footer */}
      <HorizontalLine />

      <div className="max-w-7xl mx-auto border-x border-border/60">
        {/* Main footer row */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg overflow-hidden">
              <img src="/logo.png" alt="Logo" className="h-7 w-7 rounded-lg" />
            </div>
            <span className="text-sm font-medium tracking-tight">Watermelon</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-1">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground size-10 flex items-center justify-center hover:bg-muted rounded-md active:scale-95 transition-all duration-200"
            >
              <HugeiconsIcon icon={GithubIcon} size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground size-10 flex items-center justify-center hover:bg-muted rounded-md active:scale-95 transition-all duration-200"
            >
              <HugeiconsIcon icon={NewTwitterIcon} size={18} />
            </a>
          </nav>
        </div>

        {/* Separator */}
        <HorizontalLine />

        {/* Copyright row */}
        <div className="py-4 flex items-center justify-between px-4">
          <p className="text-[11px] text-muted-foreground/60">
            © {new Date().getFullYear()} Watermelon. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground/40">
            Curated with care
          </p>
        </div>
      </div>
    </div>
  )
}
