
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import type { FilterState } from "@/lib/filter-sites";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdvancedFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  counts: Record<string, Record<string, number>>;
}

export function AdvancedFiltersSheet({
  open,
  onOpenChange,
  filters,
  setFilters,
  counts,
}: AdvancedFiltersSheetProps) {
  const isMobile = useIsMobile();

  const toggleArrayFilter = (
    key: keyof Pick<FilterState, "tech" | "platform" | "animation" | "style" | "color" | "layout">,
    value: string
  ) => {
    setFilters((prev) => {
      const current = prev[key] as string[];
      const newArray = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: newArray };
    });
  };

  const resetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      tech: [],
      platform: [],
      animation: [],
      style: [],
      color: [],
      layout: [],
      sort: "newest",
    }));
  };

  const FilterGroup = ({
    title,
    filterKey,
    options,
  }: {
    title: string;
    filterKey: keyof Pick<FilterState, "tech" | "platform" | "animation" | "style" | "color" | "layout">;
    options: Record<string, number>;
  }) => (
    <div className="mb-6">
      <h4 className="mb-3 text-sm font-medium text-foreground uppercase tracking-wider">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {Object.entries(options).map(([option, count]) => {
          const isSelected = (filters[filterKey] as string[]).includes(option);
          return (
            <Badge
              key={option}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all active:scale-95 ${isSelected ? "" : "hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => toggleArrayFilter(filterKey, option)}
            >
              {option}
              <span className="ml-1.5 opacity-60 text-[10px]">{count}</span>
              {isSelected && <Check className="ml-1 h-3 w-3" />}
            </Badge>
          );
        })}
      </div>
    </div>
  );

  const FilterContent = () => (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-medium text-foreground uppercase tracking-wider">Sort By</h4>
        <div className="flex gap-2">
          {["newest", "featured", "alphabetical"].map((opt) => (
            <Button
              key={opt}
              variant={filters.sort === opt ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters((prev) => ({ ...prev, sort: opt as any }))}
              className="capitalize active:scale-95 transition-transform"
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      <FilterGroup title="Tech Stack" filterKey="tech" options={counts.tech} />
      <FilterGroup title="Platform" filterKey="platform" options={counts.platform} />
      <FilterGroup title="Animation" filterKey="animation" options={counts.animation} />
      <FilterGroup title="Style" filterKey="style" options={counts.style} />
      <FilterGroup title="Color" filterKey="color" options={counts.color} />
      <FilterGroup title="Layout" filterKey="layout" options={counts.layout} />
    </div>
  );

  if (!isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md overflow-hidden flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-xl">Filters</SheetTitle>
            <SheetDescription>Refine your inspiration search.</SheetDescription>
          </SheetHeader>
          <FilterContent />
          <SheetFooter className="px-6 py-6 border-t mt-auto bg-muted/20">
            <Button variant="outline" className="w-full" onClick={resetFilters}>
              Reset all
            </Button>
            <SheetClose>
              <Button className="w-full">Show Results</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] flex flex-col">
        <DrawerHeader className="text-left px-6 border-b pb-4">
          <DrawerTitle className="text-xl">Filters</DrawerTitle>
          <DrawerDescription>Refine your inspiration search.</DrawerDescription>
        </DrawerHeader>
        <FilterContent />
        <DrawerFooter className="px-6 py-6 border-t bg-muted/20">
          <Button className="w-full" onClick={() => onOpenChange(false)}>Show Results</Button>
          <Button variant="outline" className="w-full" onClick={resetFilters}>
            Reset all
          </Button>
          <DrawerClose>
            <Button variant="ghost" className="w-full">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
