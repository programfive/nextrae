"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ComboboxItem = {
  label: string;
  value: string;
};

type BaseProps = {
  items: ComboboxItem[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  triggerClassName?: string;
  contentClassName?: string;
  renderLabel?: (item: ComboboxItem) => ReactNode;
};

export type ComboboxProps = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Button>, "onChange" | "value">;

export function Combobox({
  items,
  value,
  onChange,
  placeholder = "Selecciona una opción...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron resultados.",
  triggerClassName,
  contentClassName,
  renderLabel,
  className,
  ...buttonProps
}: ComboboxProps) {
  const selected = items.find((item) => item.value === value) ?? null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          role="combobox"
          variant="outline"
          className={cn(
            "w-full justify-between",
            !selected && "text-muted-foreground",
            triggerClassName,
            className
          )}
          {...buttonProps}
        >
          {selected ? (renderLabel ? renderLabel(selected) : selected.label) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-[--radix-popover-trigger-width] p-0", contentClassName)}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.label}
                onSelect={() => onChange(item.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    item.value === value ? "opacity-100" : "opacity-0"
                  )}
                />
                {renderLabel ? renderLabel(item) : item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
