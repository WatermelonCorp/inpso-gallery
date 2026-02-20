import * as React from "react"
import { useNavigate } from "react-router-dom"


import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import { sites } from "@/content/sites"
import { HugeiconsIcon } from "@hugeicons/react"
import { Command, Search01Icon, Home01Icon } from "@hugeicons/core-free-icons"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      {/* Trigger */}
      <InputGroup
        onClick={() => setOpen(true)}
        className="
          w-full
          cursor-pointer
          bg-muted/40
          hover:bg-muted/60
          transition-colors
          h-10
          md:w-48
          lg:w-72
        "
      >
        {/* Search Icon */}
        <InputGroupAddon>
          <HugeiconsIcon icon={Search01Icon} className="h-4 w-4 text-muted-foreground" />
        </InputGroupAddon>

        {/* Fake Input */}
        <InputGroupInput
          readOnly
          placeholder="Search sites..."
          className="
            cursor-pointer
            bg-transparent
            focus-visible:ring-0
            hidden
            sm:block
          "
        />

        {/* Right Side */}
        <InputGroupAddon align="inline-end" className="pl-2 sm:pl-0">
          <kbd className="flex items-center gap-1 p-1.5 rounded border bg-muted font-mono text-[10px] font-medium">
            <HugeiconsIcon icon={Command} size={14} />
            K
          </kbd>
        </InputGroupAddon>
      </InputGroup>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
              <HugeiconsIcon icon={Home01Icon} className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Sites">
            {sites.map((site) => (
              <CommandItem
                key={site.slug}
                onSelect={() =>
                  runCommand(() => window.open(site.url, "_blank"))
                }
              >
                <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary/10">
                  <img
                    src={site.thumbnail}
                    alt={site.name}
                    className="h-4 w-4 rounded-sm object-cover"
                  />
                </div>

                <span>{site.name}</span>
                <CommandShortcut>{site.category}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
