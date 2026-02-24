
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { FilterState } from "@/lib/filter-sites";
import { PrimaryButton } from "./primary-button";
import { HugeiconsIcon } from "@hugeicons/react";
import { X, SlidersHorizontal } from "@hugeicons/core-free-icons";
import { motion } from "motion/react"

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenAdvancedFilters: () => void;
  className?: string;
}

const CATEGORIES = ["all", "landing page", "product design", "mobile app", "dashboards", "branding", "motion design"];

const DESIGN_QUICK_TAGS = [
  "minimalism", "glassmorphism", "brutalism", "neomorphism", "retro",
  "futuristic", "organic", "editorial", "swiss", "skeuomorphism",
];

import { cn } from "@/lib/utils";

export function FilterBar({ filters, setFilters, onOpenAdvancedFilters, className }: FilterBarProps) {


  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
  };

  const toggleAesthetic = (tag: string) => {
    setFilters(prev => {
      const newAesthetics = prev.aesthetics.includes(tag)
        ? prev.aesthetics.filter(t => t !== tag)
        : [...prev.aesthetics, tag];
      return { ...prev, aesthetics: newAesthetics };
    });
  };

  const clearFilters = () => {
    setFilters(prev => ({
      ...prev,
      search: "",
      tags: [],
      aesthetics: [],
      effects: [],
      typography: [],
      composition: [],
      colorScheme: [],
      interaction: [],
      sort: "newest",
      featured: false,
    }));
  };

  const activeFilterCount = [
    ...filters.tags,
    ...filters.aesthetics,
    ...filters.effects,
    ...filters.typography,
    ...filters.composition,
    ...filters.colorScheme,
    ...filters.interaction,
  ].length + (filters.featured ? 1 : 0);

  return (
    <div className={cn("w-full space-y-6 bg-background/95 backdrop-blur-md py-4 shrink-0", className || "sticky top-0 z-30")}>
      <div className="flex flex-wrap gap-3 items-center justify-between">

        {/* Categories */}
        <Tabs value={filters.category} onValueChange={handleCategoryChange} className="w-full md:w-auto overflow-hidden">
          <TabsList className="bg-muted/50 p-1 h-auto flex-nowrap justify-start gap-1 overflow-x-auto w-full md:w-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="capitalize px-2"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Filter Trigger */}
        <div className="flex items-center gap-2 ml-auto">
          {(activeFilterCount > 0 || filters.search) && (
            <PrimaryButton variant="ghost" onClick={clearFilters} className="text-muted-foreground hover:text-foreground" iconLeft={<HugeiconsIcon icon={X} className="h-4 w-4 mr-2" />}>
              Clear
            </PrimaryButton>
          )}

          <PrimaryButton onClick={onOpenAdvancedFilters} iconLeft={<HugeiconsIcon icon={SlidersHorizontal} className="h-4 w-4" />}>
            <motion.span className="flex items-center gap-2">
              Filters
              {activeFilterCount > 0 && (
                <Badge className="size-7.5 bg-white text-primary p-0 flex items-center justify-center rounded-md text-sm -mr-3.5">
                  {activeFilterCount}
                </Badge>
              )}
            </motion.span>
          </PrimaryButton>
        </div>
      </div>

      {/* Quick Design Tags */}
      <div className="flex gap-2 overflow-x-auto md:flex-wrap pb-4 scrollbar-hide">
        {DESIGN_QUICK_TAGS.map(tag => (
          <Badge
            key={tag}
            variant={filters.aesthetics.includes(tag) ? "default" : "outline"}
            className="cursor-pointer transition-all w-auto capitalize duration-200 whitespace-nowrap rounded-md text-sm h-7 active:scale-95"
            onClick={() => toggleAesthetic(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
