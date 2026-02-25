
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PrimaryButton } from "@/components/primary-button";

import type { FilterState } from "@/lib/filter-sites";

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-hidden flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="text-xl">Filters</SheetTitle>
          <SheetDescription>Refine by design style, effects, and more.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium text-foreground uppercase tracking-wider">Sort By</h4>
            <div className="flex gap-2">
              {["newest", "featured", "alphabetical"].map((opt) => (
                <PrimaryButton
                  key={opt}
                  variant={filters.sort === opt ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters((prev) => ({ ...prev, sort: opt as any }))}
                  className="capitalize active:scale-95 transition-transform"
                >
                  {opt}
                </PrimaryButton>
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

        <SheetFooter className="px-6 py-6 border-t mt-auto bg-muted/20">
          <PrimaryButton variant="outline" className="w-full" onClick={resetFilters}>
            Reset all
          </PrimaryButton>
          <SheetClose render={<PrimaryButton className="w-full">Show Results</PrimaryButton>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
