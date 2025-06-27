"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const list = [
  {
    value: "vn",
    label: "Visual Novel",
  },
  {
    value: "anime",
    label: "Anime",
  },
  {
    value: "manga",
    label: "Manga",
  },
  {
    value: "game",
    label: "Game",
  },
  {
    value: "film",
    label: "Film",
  },
  {
    value: "film series",
    label: "Film Series",
  },
]

export function Combobox({ value, onChange }: { value?: string; onChange: (val: string) => void }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] justify-between"
        >
          {value
            ? list.find((list) => list.value === value)?.label
            : "Select Type..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Select Type..." className="h-9" />
          <CommandList>
            <CommandEmpty>No type found.</CommandEmpty>
            <CommandGroup>
              {list.map((list) => (
                <CommandItem
                  key={list.value}
                  value={list.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {list.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === list.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
