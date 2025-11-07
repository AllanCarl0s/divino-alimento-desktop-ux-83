import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSection {
  title: string;
  options: FilterOption[];
  selectedValues: Set<string>;
  onToggle: (value: string) => void;
}

interface MobileFiltersSheetProps {
  sections: FilterSection[];
  onApply?: () => void;
  onClearAll?: () => void;
  className?: string;
}

export function MobileFiltersSheet({
  sections,
  onApply,
  onClearAll,
  className = "",
}: MobileFiltersSheetProps) {
  const [open, setOpen] = useState(false);
  
  // Count total active filters
  const totalActive = sections.reduce((sum, section) => {
    const activeCount = section.selectedValues.size;
    const hasActive = activeCount > 0 && activeCount < section.options.length;
    return sum + (hasActive ? activeCount : 0);
  }, 0);

  const handleApply = () => {
    onApply?.();
    setOpen(false);
  };

  const handleClearAll = () => {
    onClearAll?.();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-9 justify-between whitespace-nowrap transition-all duration-200 ${
            totalActive > 0 ? "border-primary/60 bg-primary/5" : ""
          } ${className}`}
          aria-expanded={open}
        >
          <span className="flex items-center gap-1.5">
            Filtros
            {totalActive > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] text-[11px] font-semibold rounded-full bg-primary text-primary-foreground px-1">
                {totalActive}
              </span>
            )}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-2" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {sections.map((section, idx) => (
            <div key={section.title}>
              {idx > 0 && <Separator className="my-6" />}
              
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-foreground">{section.title}</h4>
                
                <div className="space-y-3">
                  {section.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-start gap-3 cursor-pointer"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          section.onToggle(option.value);
                        }
                      }}
                      tabIndex={0}
                    >
                      <Checkbox
                        checked={section.selectedValues.has(option.value)}
                        onCheckedChange={() => section.onToggle(option.value)}
                        className="mt-0.5"
                      />
                      <span className="text-sm leading-tight flex-1">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="sticky bottom-0 flex items-center gap-3 px-6 py-4 border-t bg-background">
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="flex-1 h-11"
          >
            Limpar tudo
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 h-11"
          >
            Aplicar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
