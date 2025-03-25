"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Calculator, Calendar, CreditCard, Search, Settings, User, FileSpreadsheet } from "lucide-react"

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
import { Button } from "@/components/ui/button"
import { DialogTitle } from "@/components/ui/dialog"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground pl-8"
        onClick={() => setOpen(true)}
      >
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <span className="inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search Commands</DialogTitle>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard"))}
            >
              <Calculator className="mr-2 h-4 w-4" />
              Dashboard
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/transactions"))}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Transactions
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/reports"))}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Reports
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Spreadsheets">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/spreadsheets"))}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Spreadsheet Formats
              <CommandShortcut className="text-xs text-muted-foreground ml-2">(Case Sensitive)</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/settings"))}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/profile"))}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
} 