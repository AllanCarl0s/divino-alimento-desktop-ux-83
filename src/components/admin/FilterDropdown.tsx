import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  selectedValues: Set<string>;
  onToggle: (value: string) => void;
  onApply?: () => void;
  onClear?: () => void;
  className?: string;
}

export function FilterDropdown({
  title,
  options,
  selectedValues,
  onToggle,
  onApply,
  onClear,
  className = "",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const activeCount = selectedValues.size;
  const hasActive = activeCount > 0 && activeCount < options.length;

  const handleApply = () => {
    onApply?.();
    setOpen(false);
  };

  const handleClear = () => {
    onClear?.();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-9 min-w-[120px] justify-between whitespace-nowrap transition-all duration-200 ${
            hasActive ? "border-primary/60 bg-primary/5" : ""
          } ${className}`}
          aria-expanded={open}
          aria-controls={`${title}-filter-content`}
        >
          <span className="flex items-center gap-1.5">
            {title}
            {hasActive && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] text-[11px] font-semibold rounded-full bg-primary text-primary-foreground px-1">
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0 pointer-events-auto"
        align="end"
        id={`${title}-filter-content`}
      >
        <div className="flex flex-col">
          <div className="px-4 py-3 border-b">
            <h4 className="font-semibold text-sm">{title}</h4>
          </div>
          
          <div className="py-2 max-h-[320px] overflow-y-auto">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 px-4 py-2.5 hover:bg-muted/50 cursor-pointer transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggle(option.value);
                  }
                }}
                tabIndex={0}
              >
                <Checkbox
                  checked={selectedValues.has(option.value)}
                  onCheckedChange={() => onToggle(option.value)}
                  className="mt-0.5"
                />
                <span className="text-sm leading-tight flex-1">{option.label}</span>
              </label>
            ))}
          </div>
          
          <div className="flex items-center gap-2 px-4 py-3 border-t bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="flex-1 h-8"
            >
              Limpar
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="flex-1 h-8"
            >
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
