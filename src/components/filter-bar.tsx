
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { FilterState } from "@/lib/filter-sites";

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenAdvancedFilters: () => void;
  uniqueTags: string[];
}

const CATEGORIES = ["all", "inspiration", "tools", "saas", "portfolio", "landing-page"];

export function FilterBar({ filters, setFilters, onOpenAdvancedFilters, uniqueTags }: FilterBarProps) {


  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    })
  }

  const clearFilters = () => {
    setFilters(prev => ({
      ...prev,
      search: "",
      tags: [],
      tech: [],
      platform: [],
      animation: [],
      style: [],
      color: [],
      layout: [],
      sort: "newest",
      featured: false,
    }));
  };

  const activeFilterCount = [
    ...filters.tags,
    ...filters.tech,
    ...filters.platform,
    ...filters.animation,
    ...filters.style,
    ...filters.color,
    ...filters.layout
  ].length + (filters.featured ? 1 : 0);

  return (
    <div className="w-full space-y-6 sticky top-16 z-30 bg-background/95 backdrop-blur-md pt-6 pb-2 border-b">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Search */}


        {/* Categories */}
        <Tabs value={filters.category} onValueChange={handleCategoryChange} className="w-full md:w-auto overflow-hidden">
          <TabsList className="bg-muted/50 p-1 h-auto flex-nowrap justify-start gap-1 overflow-x-auto w-full md:w-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="capitalize px-3 py-1.5 shrink-0 whitespace-nowrap"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Filter Trigger */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {(activeFilterCount > 0 || filters.search) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}

          <Button variant={activeFilterCount > 0 ? "secondary" : "outline"} onClick={onOpenAdvancedFilters} className="gap-2 relative">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Tags (Optional: specific highly used tags) */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {uniqueTags.slice(0, 8).map(tag => (
          <Badge
            key={tag}
            variant={filters.tags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer transition-colors whitespace-nowrap rounded-md text-sm h-7"
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
