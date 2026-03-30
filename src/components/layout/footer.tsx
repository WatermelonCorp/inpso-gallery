import { HorizontalLine } from "./line"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon, NewTwitterIcon } from "@hugeicons/core-free-icons"
import { Logo } from "./logo"

export function Footer() {
  return (
    <div className="border-t border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="border-x h-10 w-full max-w-7xl mx-auto border-border/60 hidden md:block"></div>
      {/* Accent line above footer */}
      <HorizontalLine />

      <div className="max-w-7xl mx-auto border-x border-border/60">
        {/* Main footer row */}
        <div className="py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 px-4">
          {/* Brand */}
          <Logo />

          {/* Links */}
          <nav className="flex items-center gap-1">
            <a
              href="https://github.com/WatermelonCorp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-xs text-muted-foreground hover:text-foreground size-8 md:size-10 flex items-center justify-center hover:bg-muted rounded-md active:scale-95 transition-all duration-200"
            >
              <HugeiconsIcon icon={GithubIcon} size={18} />
            </a>
            <a
              href="https://x.com/watermelonshHQ"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="text-xs text-muted-foreground hover:text-foreground size-8 md:size-10 flex items-center justify-center hover:bg-muted rounded-md active:scale-95 transition-all duration-200"
            >
              <HugeiconsIcon icon={NewTwitterIcon} size={18} />
            </a>
          </nav>
        </div>

        {/* Separator */}
        <HorizontalLine />

        {/* Copyright row */}
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 px-4 text-center sm:text-left">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Watermelon. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground/80">
            Showcase of perfection
          </p>
        </div>
      </div>
    </div>
  )
}
