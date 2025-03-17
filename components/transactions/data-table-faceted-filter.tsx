"use client"

import { Check, PlusCircle } from "lucide-react"
import type { Table } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface DataTableFacetedFilterProps<TData> {
  table: Table<TData>
}

const transactionTypes = [
  {
    value: "expense",
    label: "Expense",
  },
  {
    value: "income",
    label: "Income",
  },
]

const transactionStatus = [
  {
    value: "Success",
    label: "Success",
  },
  {
    value: "Processing",
    label: "Processing",
  },
  {
    value: "Failed",
    label: "Failed",
  },
]

export function DataTableFacetedFilter<TData>({ table }: DataTableFacetedFilterProps<TData>) {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <PlusCircle className="mr-2 h-4 w-4" />
            Filter
            {table.getState().columnFilters.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                  {table.getState().columnFilters.length}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {table.getState().columnFilters.length > 0 && (
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                      {table.getState().columnFilters.length} selected
                    </Badge>
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search filters..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Type">
                {transactionTypes.map((type) => (
                  <CommandItem
                    key={type.value}
                    onSelect={() => {
                      const column = table.getColumn("type")
                      if (!column) return
                      const filterValue = column.getFilterValue() as string
                      column.setFilterValue(filterValue === type.value ? undefined : type.value)
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        table.getColumn("type")?.getFilterValue() === type.value
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    <span>{type.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Status">
                {transactionStatus.map((status) => (
                  <CommandItem
                    key={status.value}
                    onSelect={() => {
                      const column = table.getColumn("status")
                      if (!column) return
                      const filterValue = column.getFilterValue() as string
                      column.setFilterValue(filterValue === status.value ? undefined : status.value)
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        table.getColumn("status")?.getFilterValue() === status.value
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    <span>{status.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

