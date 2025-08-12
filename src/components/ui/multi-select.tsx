"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
  icon?: string; // optional logo/icon url
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  maxSelected?: number;
  className?: string;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  summaryFormatter?: (count: number) => string; // e.g. "Выбрано: X проектов"
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Выберите...",
  maxSelected,
  className,
  showSelectAll = false,
  selectAllLabel = "Выбрать все",
  summaryFormatter,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  // Безопасно приводим selected к массиву строк
  const safeSelected = Array.isArray(selected) ? selected : [];

  const handleSelect = (value: string) => {
    if (safeSelected.includes(value)) {
      onChange(safeSelected.filter((item) => item !== value));
    } else {
      if (maxSelected && safeSelected.length >= maxSelected) {
        return;
      }
      onChange([...safeSelected, value]);
    }
  };

  const selectedOptions = options.filter((option) => safeSelected.includes(option.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {safeSelected.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {safeSelected.length > 1 ? (
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {summaryFormatter ? summaryFormatter(safeSelected.length) : `${safeSelected.length} выбрано`}
                </Badge>
              ) : (
                selectedOptions.map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="rounded-sm px-1 font-normal"
                  >
                    <span className="inline-flex items-center gap-1">
                      {option.icon && (
                        <img src={option.icon} alt="" className="h-4 w-4 rounded-sm" />
                      )}
                      {option.label}
                    </span>
                  </Badge>
                ))
              )}
            </div>
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white" align="start">
        <Command>
          <CommandInput placeholder="Поиск..." />
          <CommandEmpty>Ничего не найдено.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {showSelectAll && (
              <div className="flex items-center justify-between px-2 py-1.5 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const allValues = options.map(o => o.value);
                    const isAllSelected = allValues.every(v => safeSelected.includes(v));
                    onChange(isAllSelected ? [] : allValues);
                  }}
                >
                  {selectAllLabel}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onChange([])}>Сбросить</Button>
              </div>
            )}
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
                role="option"
                aria-selected={safeSelected.includes(option.value)}
                tabIndex={0}
                className={cn(
                  "flex items-center cursor-pointer hover:bg-muted",
                  safeSelected.includes(option.value) && "bg-accent"
                )}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary transition-colors bg-white",
                    safeSelected.includes(option.value)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white border-gray-300"
                  )}
                  aria-checked={safeSelected.includes(option.value)}
                  role="checkbox"
                >
                  {safeSelected.includes(option.value) && (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                {option.icon && (
                  <img src={option.icon} alt="" className="h-6 w-6 mr-2 rounded-sm" />
                )}
                <span>{option.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}