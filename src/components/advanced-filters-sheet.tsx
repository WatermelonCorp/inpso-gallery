
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
    key: keyof Pick<FilterState, "aesthetics" | "effects" | "typography" | "composition" | "colorScheme" | "interaction">,
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
      aesthetics: [],
      effects: [],
      typography: [],
      composition: [],
      colorScheme: [],
      interaction: [],
      sort: "newest",
    }));
  };

  const FilterGroup = ({
    title,
    filterKey,
    options,
  }: {
    title: string;
    filterKey: keyof Pick<FilterState, "aesthetics" | "effects" | "typography" | "composition" | "colorScheme" | "interaction">;
    options: Record<string, number>;
  }) => (
    <div className="mb-6">
      <h4 className="mb-3 text-sm font-medium text-foreground uppercase tracking-wider">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {Object.entries(options).map(([option]) => {
          const isSelected = (filters[filterKey] as string[]).includes(option);
          return (
            <Badge
              key={option}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 active:scale-95 w-auto capitalize whitespace-nowrap rounded-md text-sm h-7 ${isSelected ? "shadow-sm shadow-primary/20" : "hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => toggleArrayFilter(filterKey, option)}
            >
              {option}
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

      <FilterGroup title="Design Aesthetics" filterKey="aesthetics" options={counts.aesthetics || {}} />
      <FilterGroup title="Visual Effects" filterKey="effects" options={counts.effects || {}} />
      <FilterGroup title="Typography" filterKey="typography" options={counts.typography || {}} />
      <FilterGroup title="Composition" filterKey="composition" options={counts.composition || {}} />
      <FilterGroup title="Color Scheme" filterKey="colorScheme" options={counts.colorScheme || {}} />
      <FilterGroup title="Interaction" filterKey="interaction" options={counts.interaction || {}} />
    </div>
  );

  if (!isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md overflow-hidden flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-xl">Filters</SheetTitle>
            <SheetDescription>Refine by design style, effects, and more.</SheetDescription>
          </SheetHeader>
          <FilterContent />
          <SheetFooter className="px-6 py-6 border-t mt-auto bg-muted/20">
            <Button variant="outline" className="w-full" onClick={resetFilters}>
              Reset all
            </Button>
            <SheetClose render={<Button className="w-full" />}>
              Show Results
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
          <DrawerDescription>Refine by design style, effects, and more.</DrawerDescription>
        </DrawerHeader>
        <FilterContent />
        <DrawerFooter className="px-6 py-6 border-t bg-muted/20">
          <Button className="w-full" onClick={() => onOpenChange(false)}>Show Results</Button>
          <Button variant="outline" className="w-full" onClick={resetFilters}>
            Reset all
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
